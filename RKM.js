const data = [
  [0, 3],
  [1, 3],
  [3, 1],
  [5, 0],
  [6, 0],
  [4, 2],
  [7, 5],
  [8, 6],
  [2, 6],
  [9, 3],
];

const phanCum_Init = (soCum) => {
  let dict = new Map();
  for (let i = 0; i < data.length; i++) {
    dict.set(i, Math.floor(Math.random() * soCum));
  }
  return dict;
};

const thongTin_PhanCum = (dict, soCum) => {
  for (let i = 0; i < soCum; i++) {
    let s = 'Cum ' + i + ' : ';
    dict.forEach((value, key) => {
      if (value === i) s += key + ', ';
      else {
        for (let j = 0; j < value.length; j++) {
          if (value[j] === i) s += key + ', ';
        }
      }
    });
    console.log(s);
  }
};

const th1 = (c_lower, j, i) => {
  // c_lower!= 0 && c_lower = c_upper
  let centroid = 0;
  let k = 0;
  c_lower.forEach((value, key) => {
    if (value === i) {
      k++;
      centroid += data[Number(key)][j]; //lay tung phan tu trong data theo cot sao cho trong cung mot cum
    }
  });
  return k === 0 ? 0 : centroid / k;
};

const tinhTamCumArr = (c_lower, c_upper, soCum) => (th1) => {
  //Tinh so cot cua data set to
  const soCot = data[0].length;
  let arr_centroid = [];
  for (let i = 0; i < soCum; i++) {
    let arr_temp = [];
    for (let j = 0; j < soCot; j++) {
      if (JSON.stringify(c_lower) === JSON.stringify(c_upper)) {
        let kq = th1(c_lower, j, i);
        arr_temp.push(kq);
      }
    }
    arr_centroid.push(arr_temp);
  }

  return arr_centroid;
};

const tinhKhoangCach_PhanTu_TamCum_Arr = (tam_cum, soCum) => {
  const soCot = data[0].length;
  let khoangCachArr = [];
  for (let i = 0; i < data.length; i++) {
    let tempArr = [];
    for (let j = 0; j < soCum; j++) {
      let d = 0;
      for (let z = 0; z < soCot; z++) {
        d += Math.pow(data[i][z] - tam_cum[j][z], 2);
      }
      tempArr.push(Math.sqrt(d));
    }
    khoangCachArr.push(tempArr);
  }
  return khoangCachArr;
};

const phan_cum_lai = (e, khoangcachArr, soCum) => {
  let c_lower = new Map();
  let c_upper = new Map();
  for (let i = 0; i < khoangcachArr.length; i++) {
    let minOfRow = Math.min(...khoangcachArr[i]);
    let k = khoangcachArr[i].findIndex((e) => e === minOfRow);
    let arr_temp = [k];
    for (let j = 0; j < soCum; j++) {
      if (
        minOfRow !== khoangcachArr[i][j] &&
        khoangcachArr[i][j] / minOfRow <= e
      ) {
        arr_temp.push(j);
      }
    }
    if (arr_temp.length === 1) {
      c_lower.set(i, k);
      c_upper.set(i, k);
    } else {
      c_upper.set(i, arr_temp);
    }
  }
  return new Map([
    ['c_lower', c_lower],
    ['c_upper', c_upper],
  ]);
};

const RKM = (e, soCum) => {
  //Random cac phan tu vao cac cum
  //let c_lower = phanCum_Init(soCum);
  const c_lower = new Map([
    ['0', 0],
    ['1', 2],
    ['2', 0],
    ['3', 1],
    ['4', 1],
    ['5', 0],
    ['6', 1],
    ['7', 2],
    ['8', 0],
    ['9', 2],
  ]);

  //Khoi Tao Tam cum
  let oldCentroid = tinhTamCumArr(c_lower, c_lower, soCum)(th1);
  let newCentroid = null;
  let phan_cum = null;
  while (true) {
    let flag = false;
    if (newCentroid) {
      for (let i = 0; i < newCentroid?.length; i++) {
        for (let j = 0; j < soCum; j++) {
          if (newCentroid[i][j] - oldCentroid[i][j] > 0.01) {
            flag = true;
            oldCentroid = newCentroid;
            newCentroid = null;
            break;
          }
        }
      }
    }
    if (!newCentroid || flag) {
      const khoangcachArr = tinhKhoangCach_PhanTu_TamCum_Arr(
        oldCentroid,
        soCum
      );
      phan_cum = phan_cum_lai(e, khoangcachArr, soCum);
      newCentroid = tinhTamCumArr(
        phan_cum.get('c_lower'),
        phan_cum.get('c_upper'),
        soCum
      )(th1);
    } else
      return new Map([
        ['newCentroid', newCentroid],
        ['phan_cum', phan_cum],
      ]);
  }
};

const main = () => {
  const kq = RKM(20, 3);
  //console.log(kq);
};

main();
