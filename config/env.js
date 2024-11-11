export default {
	home: process.env.HOME,
	session_ttl: 3600 * 24 * 7,
	session_path: `${process.env.HOME}/sessions`,
	backup_dir: './backups'
};
