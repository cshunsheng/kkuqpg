let data = [
  {
    id: 1,
    prices: [11, 12, 34, 12]
  },
  {
    id: 2,
    prices: [11, 12, 34, 12]
  }
]

function flatArray(arr) {
  let flattedArray = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].prices.length; j++) {
      flattedArray.push({
        id: arr[i].id,
        price: arr[i].prices[j]
      })
    }
  }
  console.info(flattedArray)
}

flatArray(data)