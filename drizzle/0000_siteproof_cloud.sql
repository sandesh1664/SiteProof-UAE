CREATE TABLE sp_workspaces(id TEXT PRIMARY KEY,demo INTEGER NOT NULL DEFAULT 0,created INTEGER NOT NULL);
--> statement-breakpoint

CREATE TABLE sp_users(id INTEGER PRIMARY KEY,workspace_id TEXT NOT NULL REFERENCES sp_workspaces(id),name TEXT,email TEXT UNIQUE,password TEXT,role TEXT);
--> statement-breakpoint

CREATE TABLE sp_sessions(token TEXT PRIMARY KEY,user_id INTEGER,expires INTEGER);
--> statement-breakpoint

CREATE TABLE sp_jobs(id INTEGER PRIMARY KEY,workspace_id TEXT NOT NULL REFERENCES sp_workspaces(id),title TEXT,client TEXT,email TEXT,phone TEXT,location TEXT,city TEXT,category TEXT,amount REAL,date TEXT,technician INTEGER,status TEXT DEFAULT 'Scheduled',scope TEXT,token TEXT UNIQUE,created TEXT DEFAULT CURRENT_TIMESTAMP);
--> statement-breakpoint

CREATE TABLE sp_tasks(id INTEGER PRIMARY KEY,job_id INTEGER REFERENCES sp_jobs(id),label TEXT,done INTEGER DEFAULT 0);
--> statement-breakpoint

CREATE TABLE sp_evidence(id INTEGER PRIMARY KEY,job_id INTEGER REFERENCES sp_jobs(id),kind TEXT,note TEXT,image TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP);
--> statement-breakpoint

CREATE TABLE sp_variations(id INTEGER PRIMARY KEY,job_id INTEGER REFERENCES sp_jobs(id),description TEXT,amount REAL,status TEXT DEFAULT 'Pending');
--> statement-breakpoint

CREATE TABLE sp_activity(id INTEGER PRIMARY KEY,job_id INTEGER,actor TEXT,message TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP);
--> statement-breakpoint

CREATE TABLE sp_approvals(id INTEGER PRIMARY KEY,job_id INTEGER,name TEXT,decision TEXT,comment TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP);
--> statement-breakpoint

CREATE TABLE sp_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
--> statement-breakpoint

CREATE INDEX sp_jobs_workspace ON sp_jobs(workspace_id);
--> statement-breakpoint

CREATE INDEX sp_users_workspace ON sp_users(workspace_id);
--> statement-breakpoint

