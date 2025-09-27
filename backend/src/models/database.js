const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'xpertscan.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
const initDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Hospitals table
    db.run(`CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      user_id INTEGER,
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Radiologists table
    db.run(`CREATE TABLE IF NOT EXISTS radiologists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      specialization TEXT,
      years_experience INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Scans table
    db.run(`CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospital_id INTEGER,
      patient_id TEXT NOT NULL,
      scan_type TEXT NOT NULL,
      image_path TEXT NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    )`);

    // Jobs table
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER,
      radiologist_id INTEGER NULL,
      status TEXT DEFAULT 'open', 
      ai_confidence REAL,
      ai_prediction TEXT,
      heatmap_path TEXT,
      assigned_at TIMESTAMP,
      completed_at TIMESTAMP,
      report TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scan_id) REFERENCES scans(id),
      FOREIGN KEY (radiologist_id) REFERENCES radiologists(id)
    )`);

    // Insert some demo users if they don't exist
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) {
        console.error(err);
        return;
      }
      
      if (row.count === 0) {
        // Insert a hospital user
        db.run(`INSERT INTO users (email, password, name, role) 
                VALUES ('hospital@example.com', 'password', 'General Hospital', 'hospital')`, function(err) {
          if (err) {
            console.error(err);
            return;
          }
          
          const hospitalUserId = this.lastID;
          db.run(`INSERT INTO hospitals (name, user_id, address) 
                  VALUES ('General Hospital', ?, '123 Medical Center Blvd')`, [hospitalUserId]);
        });

        // Insert a radiologist user
        db.run(`INSERT INTO users (email, password, name, role) 
                VALUES ('rad@example.com', 'password', 'Dr. Jane Smith', 'radiologist')`, function(err) {
          if (err) {
            console.error(err);
            return;
          }
          
          const radiologistUserId = this.lastID;
          db.run(`INSERT INTO radiologists (user_id, specialization, years_experience) 
                  VALUES (?, 'Chest Radiology', 8)`, [radiologistUserId]);
        });
      }
    });

    // Insert some demo scans if they don't exist
    db.get("SELECT COUNT(*) as count FROM scans", (err, row) => {
      if (err) {
        console.error(err);
        return;
      }
      
      if (row.count === 0) {
        // Get hospital ID
        db.get("SELECT id FROM hospitals LIMIT 1", (err, hospital) => {
          if (err || !hospital) {
            console.error(err || "No hospital found");
            return;
          }
          
          // Sample scan data
          const sampleScans = [
            {
              patient_id: 'P12345',
              scan_type: 'Chest X-Ray',
              image_path: '/samples/chest_xray_1.jpg',
              priority: 'high'
            },
            {
              patient_id: 'P12346',
              scan_type: 'Chest X-Ray',
              image_path: '/samples/chest_xray_2.jpg',
              priority: 'medium'
            },
            {
              patient_id: 'P12347',
              scan_type: 'Chest X-Ray',
              image_path: '/samples/chest_xray_3.jpg',
              priority: 'low'
            },
            {
              patient_id: 'P12348',
              scan_type: 'Chest X-Ray',
              image_path: '/samples/chest_xray_4.jpg',
              priority: 'high'
            }
          ];
          
          // Insert scans and create jobs
          sampleScans.forEach(scan => {
            db.run(`INSERT INTO scans (hospital_id, patient_id, scan_type, image_path, priority) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [hospital.id, scan.patient_id, scan.scan_type, scan.image_path, scan.priority],
                    function(err) {
              if (err) {
                console.error(err);
                return;
              }
              
              const scanId = this.lastID;
              // Create a job for each scan
              db.run(`INSERT INTO jobs (scan_id, status, ai_confidence, ai_prediction) 
                      VALUES (?, 'open', ?, ?)`, 
                      [scanId, Math.random() * 0.5 + 0.5, Math.random() > 0.5 ? 'Pneumonia' : 'Normal']);
            });
          });
        });
      }
    });
  });
};

module.exports = {
  db,
  initDatabase
};