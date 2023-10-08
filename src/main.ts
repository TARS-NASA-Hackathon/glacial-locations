import * as csvToJson from 'convert-csv-to-json';
import * as fs from 'fs';
import { CS2EO } from './interface';

function getDataFromCS3EO() {
  const data: any[] = csvToJson.fieldDelimiter(',').getJsonFromCsv("./src/input/cs2eo.csv")

  return data
}

function parsedLatAndLon(latAndLon: string) {
  const parsedLatAndLon = latAndLon.replace('(', '').replace(')', '').split('. ')

  return parsedLatAndLon
}

function extractLonLatFromData(cs3eo: CS2EO[]) {
  const arrayOfLonAndLat = cs3eo.map((glacialZone) => {
    const bottomLeft = parsedLatAndLon(glacialZone['(bllat.bllon)'])
    const bottomRight = parsedLatAndLon(glacialZone['(brlat.brlon)'])
    const topRight = parsedLatAndLon(glacialZone['(trlat.trlon)'])
    const topLeft = parsedLatAndLon(glacialZone['(tllat.tllon)'])


    return [
      ...bottomLeft,
      ...bottomRight,
      ...topRight,
      ...topLeft,
      ...bottomLeft
    ]    
  })

  return arrayOfLonAndLat
}

async function createCsvFileFromJson(arrayOfLonAndLat: any[]) {

    fs.writeFileSync('./src/output/glacial-locations.json', JSON.stringify(arrayOfLonAndLat))
}



function createGlacialLocationsFile() {
  const cs3eo = getDataFromCS3EO()
  const arrayOfLonAndLat = extractLonLatFromData(cs3eo)

  
  createCsvFileFromJson(arrayOfLonAndLat)

}

createGlacialLocationsFile();
