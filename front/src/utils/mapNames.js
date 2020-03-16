import axios from 'axios';


function idToName(data, extractValue, mappedNames, isItem=false) {
    let Ids;
    if (isItem) {
      return mapItems(data, extractValue, mappedNames);
    } else {
      const dataArray = [].concat(data);
      Ids = dataArray.map(entry => {
        return entry[extractValue];
      });
      dataArray.map((entry, index) => {
        const newIndex = extractValue.includes("Id") ? extractValue.replace("Id", "Info") : extractValue + "Info";
        return entry[newIndex] = mappedNames.get(Ids[index]);
      });
      return dataArray;
    }
}

async function getNames(endpoint, isItem=false) {
    //Makes a call to riot api and retrieves data about Champs
    const {data} = await axios.get(endpoint);
    const namesData = data.data;
    //Creates a map {id: {name, image, tags}}
    const namesId = new Map();
    for (let key of Object.keys(namesData)) {
      namesId.set(!isItem ? Number(namesData[key].key) : Number(key), namesData[key].tags ? 
      {name: namesData[key].name, image: namesData[key].image, tags: namesData[key].tags} :
      {name: namesData[key].name, image: namesData[key].image});
    }
    return namesId;
}
  
  async function mapItems(data, extractValue, mappedNames) {
    const itemKeys = extractValue;
    const Ids = itemKeys.map(item => {
      return data.stats[item];
    });
    itemKeys.map((item, index) => {
      return data.stats[item] = mappedNames.get(Ids[index]);
    });
    return data;
}

export {idToName, getNames};