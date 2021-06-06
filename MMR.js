const duLieu = [
  {
    id: '1',
    a1: 'Big',
    a2: ' Blue',
    a3: 'Hard',
    a4: 'Indefinite',
    a5: 'Plastic',
    a6: 'Negative',
  },
  {
    id: '2',
    a1: 'Medium',
    a2: 'Red',
    a3: 'Moderate',
    a4: 'Smooth',
    a5: 'Wood',
    a6: 'Neutral',
  },
  {
    id: '3',
    a1: 'Small',
    a2: 'Yellow',
    a3: 'Soft',
    a4: 'Fuzzy',
    a5: 'Plush',
    a6: 'Positive',
  },
  {
    id: '4',
    a1: 'Medium',
    a2: 'Blue',
    a3: 'Moderate',
    a4: 'Fuzzy',
    a5: 'Plastic',
    a6: 'Negative',
  },
  {
    id: '5',
    a1: 'Small',
    a2: 'Yellow',
    a3: 'Soft',
    a4: 'Indefinite',
    a5: 'Plastic',
    a6: 'Neutral',
  },
  {
    id: '6',
    a1: 'Big',
    a2: 'Green',
    a3: 'Hard',
    a4: 'Smooth',
    a2: 'Wood',
    a5: 'Positive',
  },
  {
    id: '7',
    a1: 'Small',
    a2: 'Yellow',
    a3: 'Hard',
    a4: 'Indefinite',
    a5: 'Metal',
    a6: 'Positive',
  },
  {
    id: '8',
    a1: 'Small',
    a2: 'Yellow',
    a3: 'Soft',
    a4: 'Indefinite',
    a5: 'Plastic',
    a6: 'Positive',
  },
  {
    id: '9',
    a1: 'Big',
    a2: 'Green',
    a3: 'Hard',
    a4: 'Smooth',
    a5: 'Wood',
    a6: 'Neutral',
  },
  {
    id: '10',
    a1: 'Medium',
    a2: 'Green',
    a3: 'Moderate',
    a4: 'Smooth',
    a5: 'Plastic',
    a6: 'Neutral',
  },
];

const titles = ['id', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6'];

//Xac dinh danh cac quyet dinh W(Yes) va W(No)
const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const tinhDoChinhXacCuaXapXi = (list) => {
  let kq = new Map();
  for (let i = 1; i < titles.length; i++) {
    // Duyet qua tung titles
    //Phan loai list (data) theo tung title
    groupBy(list, (key) => key[titles[i]]).forEach((element1, keyOfGroup) => {
      //Phan loai theo cac title con lai
      let arr_temp = [];
      for (let j = 1; j < titles.length; j++) {
        if (j !== i) {
          let x_upper = [];
          let x_lower = [];
          groupBy(list, (key) => key[titles[j]]).forEach((element2) => {
            let flag1 = true;
            let flag2 = false;

            element2.forEach((props) => {
              if (props[titles[i]] !== keyOfGroup) flag1 = false;
              else flag2 = true;
            });
            if (flag1) x_lower.push(element2);
            if (flag2) x_upper.push(element2);
          });

          const roughness = 1 - x_lower.length / x_upper.length;
          arr_temp.push(roughness);
          kq.set(`${titles[i]}/${keyOfGroup}`, arr_temp);
        }
      }
    });
  }
  return kq;
};

const tinhMeanRoughness = (doChinhXacs) => {
  let kq = new Map();
  doChinhXacs.forEach((value, key) => {
    const sum = value.reduce((acc, cur) => acc + cur);
    const average = sum / value.length;
    kq.set(key, average);
  });
  return kq;
};

const tinhMeanMeanRoughness = (meanRoughness) => {
  let kq = new Map();
  for (let i = 1; i < titles.length; i++) {
    let sum = 0;
    let dem = 0;
    meanRoughness.forEach((value, key) => {
      if (key.includes(`${titles[i]}/`)) {
        dem++;
        sum += value;
      }
    });
    kq.set(titles[i], sum / dem);
  }
  return kq;
};

const tinhMinMeanMeanRoughness = (meanMeanRoughness) => {
  let thuocTinhMin = '';
  let minMeanMeanRoughness = 9999;
  meanMeanRoughness.forEach((value, key) => {
    if (value < minMeanMeanRoughness) {
      minMeanMeanRoughness = value;
      thuocTinhMin = key;
    }
  });
  return {
    thuocTinhMin,
    minMeanMeanRoughness,
  };
};

const timGiaTriPhanCum = (meanRoughness, thuocTinhPhanCum) => {
  const {thuocTinhMin, minMeanMeanRoughness} = thuocTinhPhanCum;
  let min = 9999;
  let positon = '';
  meanRoughness.forEach((value, key) => {
    if (
      key.includes(`${thuocTinhMin}/`) &&
      Math.abs(value - minMeanMeanRoughness) < min
    ) {
      min = value - minMeanMeanRoughness;
      positon = key;
    }
  });
  return positon.split('/')[1];
};

const MMRMain = (data, cum_hien_tai) => {
  const doChinhXacs = tinhDoChinhXacCuaXapXi(data);
  // console.log('====================================');
  // console.log('Do Chinh xac', doChinhXacs);
  // console.log('====================================');

  const meanRoughness = tinhMeanRoughness(doChinhXacs);
  // console.log('====================================');
  // console.log('tinh Mean Roughness', meanRoughness);
  // console.log('====================================');

  const meanMeanRoughness = tinhMeanMeanRoughness(meanRoughness);
  // console.log('====================================');
  // console.log('Mean mean Roughness', meanMeanRoughness);
  // console.log('====================================');

  const {thuocTinhMin, minMeanMeanRoughness} =
    tinhMinMeanMeanRoughness(meanMeanRoughness);
  // console.log('====================================');
  // console.log('Min Mean mean Roughness: ', thuocTinhMin, minMeanMeanRoughness);
  // console.log('====================================');

  const giaTriPhanCum = timGiaTriPhanCum(meanRoughness, {
    thuocTinhMin,
    minMeanMeanRoughness,
  });
  // console.log('====================================');
  // console.log('Gia Tri Phan Cum', giaTriPhanCum);
  // console.log('====================================');

  return {thuocTinhMin, giaTriPhanCum};
};

const main = (soCum) => {
  let cum_hien_tai = 1;
  let data = duLieu;
  let cums = new Map();
  let cum_temp = cum_hien_tai;
  while (cum_hien_tai < soCum) {
    const {thuocTinhMin, giaTriPhanCum} = MMRMain(data, cum_hien_tai);
    const cum1 = data.filter((e) => e[thuocTinhMin] === giaTriPhanCum);
    const cum2 = data.filter((e) => e[thuocTinhMin] !== giaTriPhanCum);

    cums.set(`${cum_temp}`, cum1);
    cum_hien_tai++;
    cums.set(`${cum_hien_tai}`, cum2);

    let maxElement = 0;
    for (let i = 1; i <= cum_hien_tai; i++) {
      if (cums.get(`${i}`).length > maxElement) {
        maxElement = cums.get(`${i}`).length;
        data = cums.get(`${i}`);
        cum_temp = i;
      }
    }
  }

  let cumNgoaiLe = [];
  cums.forEach((value, key) => {
    if (value.length < 0.3 * duLieu.length) {
      cumNgoaiLe.push(key);
    }
  });
  console.log('Ket qua', cums);
  console.log('====================================');
  console.log('Cum Ngoai le: ', cumNgoaiLe);
  console.log('====================================');
};
main(3);
