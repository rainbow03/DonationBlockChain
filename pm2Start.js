{
	"apps": [{
		"name": "DB",
		"cwd": "e:/dev/mongodb32/bin",
		"script": "./mongod.exe",
		"args": "--dbpath e:/dev/mongodb32/donationBC --bind_ip 127.0.0.1 --port 25019",
		"watch": false
	}, {
		"name": "API",
		"cwd": "e:/dev/donationBC",
		"script": "./app.js",
		"error_file": "./logs/donationBC_err.log",
		"out_file": "./logs/donationBC_out.log",
		"pid_file": "./logs/donationBC.pid",
		"merge_logs": true,
		"log_date_format": "YYYY-MM-DD",
		"watch": true,
		"max_restarts": 16,
		"ignore_watch": ["public", "node_modules", "logs", ".git", "jsonConfig"]
	}]
}