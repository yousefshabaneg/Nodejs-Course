const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject('I Could not found that file.');

      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, 'utf8', (err) => {
      if (err) reject('I Could not found that file.');

      resolve('Image saved to images file');
    });
  });
};

//Chaining promises by returning a promise to use them in then.
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     const breed = data.toString().trim();
//     console.log(`Breed: ${breed}`);
//     return superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
//   })
//   .then((res) => writeFilePro(`${__dirname}/dog-img.txt`, res.body.message))
//   .then((res) => console.log(res))
//   .catch((err) => console.log('Error: ' + err.message));

//Consuming Promises with async/await
// const getNewDogImage = async () => {
//   try {
//     const breedName = (await readFilePro(`${__dirname}/dog.txt`)).toString().trim();
//     const result = await superagent.get(`https://dog.ceo/api/breed/${breedName}/images/random`);
//     const insertImageLink = await writeFilePro(`${__dirname}/dog-img.txt`, result.body.message);
//     return insertImageLink;
//   } catch (err) {
//     throw err;
//   }
// };
// (async () => {
//   try {
//     console.log('1: Will get dog pics');
//     const img = await getNewDogImage();
//     console.log(img);
//     console.log('2: Done getting dog pics');
//   } catch (err) {
//     console.log('Error: 💥💥');
//   }
// })();

//Waiting multiple promises simultaneously
const getNewDogImage = async () => {
  try {
    const breedName = (await readFilePro(`${__dirname}/dog.txt`)).toString().trim();
    const imgsPromises = [
      superagent.get(`https://dog.ceo/api/breed/${breedName}/images/random`),
      superagent.get(`https://dog.ceo/api/breed/${breedName}/images/random`),
      superagent.get(`https://dog.ceo/api/breed/${breedName}/images/random`),
    ];
    const imagesRes = await Promise.all(imgsPromises);
    const imagesArray = imagesRes.map((img) => img.body.message).join('\n');
    const insertImageLink = await writeFilePro(`${__dirname}/dog-img.txt`, imagesArray);
    return insertImageLink;
  } catch (err) {
    throw err;
  }
};

getNewDogImage();
