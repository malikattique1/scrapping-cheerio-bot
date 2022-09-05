
const router = require("express").Router();
const pool = require("../../config/database");

const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jquery = require('jquery')(dom.window)

const searchGoogle = require('./searchGoogle.controller.js');
router.get('/search', (request, response) => {
    const params = request.params.search;
    if (params == null) {
        searchGoogle(params)
        .then(results => {
            response.status(200);
            response.json(results);
            // return
            queryPromise1 = () =>{
                return new Promise((resolve, reject)=>{
                    pool.query('select id,country,hostname,ipaddress from vpngate',  (error, results)=>{
                        if(error){
                            return reject(error);
                        }
                        jsonobj=JSON.parse(JSON.stringify(results))
                        return resolve(jsonobj);
                    });
                });
            }
            async function sequentialQueries () {
                const resultdb = await queryPromise1();
                // console.log("querypromiseResultfromDB",resultdb)
                DbAllOnlyIpsDataArr=[];
                DB=resultdb.forEach (db => {
                    DbAllOnlyIpsDataArr.push(db.ipaddress)
                });
                console.log("DbAllOnlyIpsDataArr",DbAllOnlyIpsDataArr);
                SiteAllDataArr=[];
                SITE=results.forEach (site => {
                    SiteAllDataArr.push(site)
                });
                // console.log("SiteAllDataArr",SiteAllDataArr)
                uniqueNewResults=[];
                jquery.each(SiteAllDataArr, function(i, elm_site){
                    if(jquery.inArray(elm_site['ipaddress'], DbAllOnlyIpsDataArr) === -1) uniqueNewResults.push(elm_site);
                });
                // console.log("uniqueNewResults",uniqueNewResults);
                if (uniqueNewResults.length === 0){
                    console.log("same record scrapped");
                    // return
                    // now skip inserting step

                    // testing db all ips if working
                    dbWorkingIpsArr=[]
                    queryPromise1 = () =>{
                        return new Promise((resolve, reject)=>{
                            var ping = require('ping');
                            DbAllOnlyIpsDataArr.forEach(function (ipaddress,i) {
                                length=DbAllOnlyIpsDataArr.length-1;
                                ping.promise.probe(ipaddress)
                                    .then(function (res) {
                                        // console.log(res);
                                        // console.log(res.alive);
                                        if(res.alive==true){
                                            dbWorkingIpsArr.push(ipaddress);
                                            // console.log("s",dbWorkingIpsArr);
                                            if (i == length) {
                                                return resolve(dbWorkingIpsArr);
                                            }
                                        }
                                        else if(res.alive==false){
                                            if (i == length) {
                                              return resolve(workingipsarr);
                                            }
                                            return
                                          }
                            
                                    });
                            });

                

                        });
                    }
                    var DbAllWorkingIpsArr = await queryPromise1();
                    console.log("DbAllWorkingIpsArr",DbAllWorkingIpsArr);
                    
                    const filteredIpsNotworkinginDb = DbAllOnlyIpsDataArr.filter((f) => !DbAllWorkingIpsArr.includes(f))
                    console.log("filteredIpsNotworkinginDb", filteredIpsNotworkinginDb);
                    
                    const fs = require('fs');
                    filteredIpsNotworkinginDb.forEach((ip , index) => {
                        // deleting not working ips record from directory
                        var filePath = `./files/${ip}.ovpn`; 
                        if(!fs.existsSync(filePath)) {
                            console.log("File not found");
                        }else{
                            fs.unlinkSync(filePath);
                        }
                        
                        // deleting not working ips record from db
                        pool.query(
                            `delete from vpngate where ipaddress = ?`,
                            [`${[ip]}`],
                            (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                }
                                return (null, results);
                            }
                            );
                        });
                        
                        
                        
                        
                    }

                    else{
                        console.log("not same, new results found")
                        // inserting new unique results in db
                        uniqueNewResults.forEach(result => {
                            pool.query(
                                `insert into vpngate(country,countryflag,hostname,ipaddress,vpnsessions,users,linequality,ping,score,ovpnfilelink,ovpndownloadpath) 
                                values(?,?,?,?,?,?,?,?,?,?,?)`,
                                [
                                    `${[result.country]}`,
                                    `${[result.countryflag]}`,
                                    `${[result.hostname]}`,
                                    `${[result.ipaddress]}`,
                                    `${[result.vpnsessions]}`,
                                    `${[result.users]}`,
                                    `${[result.linequality]}`,
                                    `${[result.ping]}`,
                                    `${[result.score]}`,
                                    `${[result.ovpnfilelink]}`,
                                    `${[result.ovpndownloadpath]}`
                                ],
                                (error, results, fields) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                    return (null, results);
                                }
                                );
                            });
                            
                            // testing db all ips if working
                            dbWorkingIpsArr=[]
                            queryPromise1 = () =>{
                                return new Promise((resolve, reject)=>{
                                    var ping = require('ping');
                                    // var hosts = ['123.4'];
                                    DbAllOnlyIpsDataArr.forEach(function (ipaddress,i) {
                                        length=DbAllOnlyIpsDataArr.length-1;
                                        ping.promise.probe(ipaddress)
                                            .then(function (res) {
                                                // console.log(res);
                                                // console.log(res.alive);
                                                if(res.alive==true){
                                                    dbWorkingIpsArr.push(ipaddress);
                                                    // console.log("s",dbWorkingIpsArr);
                                                    if (i == length) {
                                                        return resolve(dbWorkingIpsArr);
                                                    }
                                                }
                                                else if(res.alive==false){
                                                    if (i == length) {
                                                      return resolve(workingipsarr);
                                                    }
                                                    return
                                                  }
                                    
                                            });
                                    });

           

                                });
                            }
                            var DbAllWorkingIpsArr = await queryPromise1();
                            console.log("DbAllWorkingIpsArr",DbAllWorkingIpsArr);
                            
                            const filteredIpsNotworkinginDb = DbAllOnlyIpsDataArr.filter((f) => !DbAllWorkingIpsArr.includes(f))
                            console.log("filteredIpsNotworkinginDb", filteredIpsNotworkinginDb);
                            
                            const fs = require('fs');
                            filteredIpsNotworkinginDb.forEach((ip , index) => {
                                // deleting not working ips record from directory
                                var filePath = `./files/${ip}.ovpn`; 
                                if(!fs.existsSync(filePath)) {
                                    console.log("File not found");
                                }else{
                                    fs.unlinkSync(filePath);
                                }
                                
                                // deleting not working ips record from db
                                pool.query(
                                    `delete from vpngate where ipaddress = ?`,
                                    [`${[ip]}`],
                                    (error, results, fields) => {
                                        if (error) {
                                            console.log(error);
                                        }
                                        return (null, results);
                                    }
                                    );
                                });
                                
                            }
                        }
                        
                        sequentialQueries();    
                        
                        
                    });
                } else {
                    response.end();
                }
            });
            //   router.get('/search', searchGoogle);
            module.exports = router;
            
            
            
            
            
            