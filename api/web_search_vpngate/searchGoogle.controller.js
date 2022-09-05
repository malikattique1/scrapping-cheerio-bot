const cheerio = require('cheerio');

const searchGoogle = async (params) => {
  
  const request = require('request-promise');
  const response = await request({
    uri: 'https://www.vpngate.net/en/',
  })
  let $ = cheerio.load(response);
  scrapeItems = [];
  $('table#vg_hosts_table_id').eq(2).find('tr').each(function (element) {
    if($(this).find('td').eq(0).text().includes('(Physical location)')) {
      return
    }
    let countries = $(this).find('td').eq(0).text();
    let country= countries.trim();
    if(country=='Korea Republic of'){
      countryflag=`https://countryflagsapi.com/png/kor`;
    }else{
      countryflag=`https://countryflagsapi.com/png/${country}`;
    }
    
    let ipaddresses = $(this).find('td').eq(1).text()
    let ipaddressext= ipaddresses.trim().split('net');
    const ipaddress = ipaddressext[1];
    
    let hostnames = $(this).find('td').eq(1).text();
    let hostnameext= hostnames.trim()
    const hostname = hostnameext.substring(0, hostnameext.indexOf(ipaddress));
    
    let sessions = $(this).find('td').eq(2).text();
    let sessionext= sessions.trim().split(' ');
    const session = sessionext[0];
    
    let users = $(this).find('td').eq(2).text();
    let usersext= users.trim().split('Total ');
    const user = usersext[1];
    
    let linequalities = $(this).find('td').eq(3);
    let linequalityext= linequalities.text().trim().split('Ping');
    const linequality = linequalityext[0];
    
    let pings = $(this).find('td').eq(3);
    let pingext= pings.text().trim().split(': ');
    const ping = pingext[1].substring(0,5);
    
    coccat='https://www.vpngate.net/en/'
    let ovpnss = $(this).find('td').eq(6).find('a').attr('href') ?  $(this).find('td').eq(6).find('a').attr('href') :false
    let ovpn=coccat+ovpnss
    
    let scores = $(this).find('td').eq(9).text().trim();
    scrapeItems.push ({
      country:country,
      countryflag:countryflag,
      hostname:hostname,
      ipaddress:ipaddress,
      vpnsessions:session,
      users:user,
      linequality:linequality,
      ovpn:ovpn,
      ping:ping,
      score:scores,
    })
  });
  // console.log(scrapeItems)
  searchResults=scrapeItems
  console.log("firstpage",searchResults);
  
  var workingipsarr=[]
  queryPromise1 = () =>{
    return new Promise((resolve, reject)=>{
      var ping = require('ping');
      searchResults.forEach(async function (searchResult,i) {
        length=searchResults.length-1;
        // console.log(i)
        // var ping = require('ping');
        ping.promise.probe(searchResult.ipaddress)
        .then(function (res) {
          // console.log(res);
          console.log(res.alive);
          if(res.alive==true){
            workingipsarr.push(searchResult.ipaddress);
            // console.log("sar",workingipsarr);
            // console.log("s",i);
            // console.log("slll",searchResults.length-1);
            if (i == length) {
              return resolve(workingipsarr);
              // resolve(workingipsarr);
            }
          }else if(res.alive==false){
            if (i == length) {
              return resolve(workingipsarr);
            }
            return
          }
        });
        
      });
      
    });
  }
  
  
  var workingIpsInSiteSearchResults = await queryPromise1();
  console.log("workingIpsInSiteSearchResults",workingIpsInSiteSearchResults);
  // return
  let filteredSearchResultsWithWorkingIps = searchResults.filter((f) => workingIpsInSiteSearchResults.includes(f.ipaddress))
  // console.log("filteredSearchResultsWithWorkingIps",filteredSearchResultsWithWorkingIps)
  //return
  ///////////////////////////////////////////for next page scraping////////////////////////////////////////////
  let nextpagelinks=[]
  filteredSearchResultsWithWorkingIps.forEach(function (searchResult) {
    nextpagelinks.push(searchResult.ovpn)
  });
  console.log("nextpagelinks",nextpagelinks);
  // return
  let datafromnextpageObjArr=[]
  for(let link of nextpagelinks){
    if (link=='https://www.vpngate.net/en/false'){
    datafromnextpageObjArr.push({ovpnfilelink:"false"})
  }
  else{
    const request = require('request-promise');
    const response = await request({
      uri: link,
    })
    let $ = cheerio.load(response);
    const ovpnfilelink= $('ul.listBigArrow > li > a').attr('href')
    coccat='https://www.vpngate.net'
    console.log("downl",coccat+ovpnfilelink)
    datafromnextpageObjArr.push({ovpnfilelink:coccat+ovpnfilelink})
  }
}
console.log("2nd page",datafromnextpageObjArr);
// return
let prefinalresultObjMap = filteredSearchResultsWithWorkingIps.map((item, i) => Object.assign({}, item, datafromnextpageObjArr[i])); 
// console.log("prefinalresultObjMap", prefinalresultObjMap);
// return
var ovpndownloadpathObjArr=[];
var https = require('https');
const fs = require('fs');
prefinalresultObjMap.forEach((url , index) => {
  filename=`${url.ipaddress}.ovpn`
  ovpndownloadpath='https://vpn.funsdevops.com/files/'+filename
  ovpndownloadpathObjArr.push({ovpndownloadpath});
  // console.log(website);
  if (url.ovpnfilelink== "false"){
    // console.log("workingaipWithnofile",url.ipaddress);
    fs.createWriteStream(`./files/${url.ipaddress}.ovpn`);
  }
  else{
    https.get(url.ovpnfilelink, res => {
      const stream = fs.createWriteStream(`./files/${url.ipaddress}.ovpn`);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
      })
    })
  }
});
// console.log("ovpndownloadpathObjArr", ovpndownloadpathObjArr);
// return
let finalresultObjMap = filteredSearchResultsWithWorkingIps.map((item, i) => Object.assign({}, item, datafromnextpageObjArr[i], ovpndownloadpathObjArr[i])); 
// console.log("finalresultObjMap", finalresultObjMap);
// return
// console.log("1st page",searchResults);
// console.log("workingIpsInSiteSearchResults",workingIpsInSiteSearchResults);
// console.log("filteredSearchResultsWithWorkingIps",filteredSearchResultsWithWorkingIps)
// console.log("nextpagelinks",nextpagelinks);
// console.log("datafromnextpageObjArr ",datafromnextpageObjArr);
// console.log("prefinalresultObjMap", prefinalresultObjMap);
// console.log("ovpndownloadpathObjArr", ovpndownloadpathObjArr);
// console.log("finalresultObjMap", finalresultObjMap);
// await browser.close();
console.log("end");
return finalresultObjMap


};
// setTimeout(searchGoogle, 300000); /* start scraping 5m */
module.exports = searchGoogle;
