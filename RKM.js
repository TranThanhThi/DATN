const data = [
  [1, 1, 3],
  [2, 2, 4],
  [2, 1, 5],
  [6, 1, 1],
  [6, 2, 2],
  [7, 2, 3],
  [60, 61, 60],
  [6, 7, 5],
  [7, 6, 4],
  [10, 19, 10],
  [65, 70, 68],
  [80, 75, 117],
  [1.01, 2.72, 1.2],
  [1.07, 2.62, 1.3],
  [1.61, 2.12, 1.6],
  [1.41, 3.02, 1.7],
  [-1.01, 2.82, 1.8],
];

const phanCum_Init = (soCum) => {
  let dict = new Map();
  for (let i = 0; i < data.length; i++) {
    if (i < soCum) {
      dict.set(i, i);
    } else dict.set(i, Math.floor(Math.random() * soCum));
  }
  return dict;
};

const compare_Clower_Cupper = (c_lower, c_upper) => {
  if (c_lower.size === 0 && c_upper.size !== 0) {
    return 1;
  } else if (c_lower.size !== 0) {
    if (c_lower.size !== c_upper.size) return 2;
    c_lower.forEach((value, key) => {
      if (c_upper.get(key).toString() !== value.toString()) return 2;
    });
    return 0;
  }
};

const th1 = (c_lower, j, i) => {
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

const th2 = (c_upper, j, i) => {
  let k = 0;
  let centroid = 0;
  c_upper.forEach((value, key) => {
    if (value === i) {
      k++;
      centroid += data[Number(key)][j];
    }
  });
  return k === 0 ? 0 : centroid / k;
};

const th3 = (c_upper, c_lower, j, i, w_up, w_low) => {
  let k = 0;
  let up = 0;
  let low = 0;

  c_upper.forEach((value, key) => {
    if (!c_lower.has(key) && value === i) {
      k++;
      up += data[Number(key)][j];
    }
  });
  up = k === 0 ? 0 : (w_up * up) / k;
  k = 0;

  c_lower.forEach((value, key) => {
    if (value === i) {
      k++;
      low += data[Number(key)][j];
    }
  });

  low = k === 0 ? 0 : (w_low * low) / k;

  return up + low;
};

const tinhTamCumArr = (c_lower, c_upper, soCum) => (th1) => (th2) => (th3) => {
  //Tinh so cot cua data set to
  const sosanh_Clower_Cupper = compare_Clower_Cupper(c_lower, c_upper);
  const soCot = data[0].length;
  let arr_centroid = [];
  for (let i = 0; i < soCum; i++) {
    let arr_temp = [];
    for (let j = 0; j < soCot; j++) {
      let kq = null;
      switch (sosanh_Clower_Cupper) {
        case 0: //clower!=0 && clower - cupper =0
          kq = th1(c_lower, j, i);
          break;
        case 1: // clower == 0 && cupper!=0
          kq = th2(c_upper, j, i);
          break;
        default:
          kq = th3(c_upper, c_lower, j, i, 0.3, 0.7);
          break;
      }
      arr_temp.push(kq);
    }
    arr_centroid.push(arr_temp);
  }
  //return arr_centroid.pop();
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
  let c_lower = phanCum_Init(soCum);
  // const c_lower = new Map([
  //   ['0', 0],
  //   ['1', 2],
  //   ['2', 0],
  //   ['3', 1],
  //   ['4', 1],
  //   ['5', 0],
  //   ['6', 1],
  //   ['7', 2],
  //   ['8', 0],
  //   ['9', 2],
  // ]);

  //Khoi Tao Tam cum
  let oldCentroid = tinhTamCumArr(c_lower, c_lower, soCum)(th1)(th2)(th3);
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
      )(th1)(th2)(th3);
    } else
      return new Map([
        ['newCentroid', newCentroid],
        ['phan_cum', phan_cum],
      ]);
  }
};

const main = () => {
  const soCum = 2;
  const rkm = RKM(1.5, soCum);

  const khoangCachCacDiemDenTam = tinhKhoangCach_PhanTu_TamCum_Arr(
    rkm.get('newCentroid'),
    soCum
  );
  let kq = [];
  let cumNgoaiLe = [];

  for (let index = 0; index < soCum; index++) {
    let dem = 0;
    rkm
      .get('phan_cum')
      .get('c_upper')
      .forEach((value, key) => {
        if (value === index) {
          dem++;
        }
        if (Array.isArray(value) && !kq.some((e) => e === key)) kq.push(key);
      });
    cumNgoaiLe.push(dem < 0.3 * data.length ? index : null);
  }
  console.log(rkm);
  console.log(kq);
  console.log('Cum ngoai le: ', cumNgoaiLe);
};

main();
