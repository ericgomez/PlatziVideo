import fs from 'fs';

const getManifest = () => {
  try {
    return JSON.parse(fs.readFileSync(`${__dirname}/public/manifest.json`, 'utf-8'));
  } catch (error) {
    console.log(error);
  }
};

export default getManifest;
