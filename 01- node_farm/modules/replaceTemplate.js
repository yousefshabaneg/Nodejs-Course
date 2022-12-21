module.exports = (temp, product) => {
  let output = temp
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NOT_ORGANIC%}/g, product.organic ? "" : "not-organic")
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%ID%}/g, product.id);
  return output;
};
