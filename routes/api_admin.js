const path = require('path');
const models = require('../models');
const fs = require('fs/promises');
const util = require('util');
const Tempo = require('@formkit/tempo');
const exec = util.promisify(require('child_process').exec);

const sequelize = models.sequelize;
const config = sequelize.config;

const backup = async () => {
    const backupDir = global.env.backup_dir || path.join(__dirname, '..');
    const now = Tempo.format(new Date(), 'YYYYMMDDHHmmss');
    const backupFilePath = path.join(backupDir, `${config.database}-${now}.dump`);
    const command = `PGPASSWORD='${config.password}' pg_dump -U ${config.username} -h ${config.host}  -p ${config.port} -b -f ${backupFilePath} ${config.database}`;

    console.log({command});
    return  (exec(command));
}

const backups = async(req, res, next) => {
    const backupDir = global.env.backup_dir || path.join(__dirname, '..');
    let rex = new RegExp(`^${config.database}-(.+).dump`);
    fs.readdir(backupDir).then((list) => {
        let files = [];
        list.map((ent) => {
            let m;
            if  ( m = ent.match(rex) )   {
                let name = ent.split('.')[0];
                let d = Tempo.parse(m[1], 'YYYYMMDDHHmmss');
                console.log(m[1], d.toLocaleString());
                files.push(d);
            }
        })
        files.sort((a, b) => {  //  DESC
            if  ( a.valueOf() > b.valueOf() )   {
                return -1;
            } else
            if  ( a.valueOf() < b.valueOf() )   {
                return 1;
            } else {
                return 0
            }
        })
        res.json(files);
    })
}

const restore = async(json) => {
    let date = new Date(json);
    //console.log({date});
    const file = Tempo.format(date, 'YYYYMMDDHHmmss');
    const backupDir = global.env.backup_dir || path.join(__dirname, '..');
    const backupFilePath = path.join(backupDir, `${config.database}-${file}.dump`);
    //console.log({backupFilePath});
    let command = `PGPASSWORD='${config.password}' dropdb -U ${config.username} -h ${config.host} -p ${config.port} -f ${config.database}`;
    //console.log({command});
    await exec(command);
    command = `PGPASSWORD='${config.password}' createdb -U ${config.username} -h ${config.host} -p ${config.port} ${config.database}`;
    //console.log({command});
    await exec(command);
    command = `PGPASSWORD='${config.password}' psql -U ${config.username} -h ${config.host} -p ${config.port} ${config.database} < ${backupFilePath}`;
    //console.log({command});
    await exec(command);
}

const remove = async(json) => {
    let date = new Date(json);
    console.log({date});
    const file = Tempo.format(date, 'YYYYMMDDHHmmss');
    const backupDir = global.env.backup_dir || path.join(__dirname, '..');
    const backupFilePath = path.join(backupDir, `${config.database}-${file}.dump`);
    //console.log({backupFilePath});
    await fs.rm(backupFilePath);
}

module.exports = {
    backups:backups,
    backup: async(req, res, next) => {
        backup().then(() =>  {
            res.json({
                code: 0
            });
        }).catch((e) => {
            console.log(e);
        })
    },
    restore: async(req, res, next) => {
        restore(req.body.date).then(() => {
            res.json({
                code: 0
            })
        }).catch((e) => {
            res.json({
                code: -1
            })
        })
    },
    delete: async(req, res, next) => {
        remove(new Date(req.params.date)).then(() => {
            res.json({
                code: 0
            })
        }).catch((e) => {
            res.json({
                code: -1
            })
        })
    }
}