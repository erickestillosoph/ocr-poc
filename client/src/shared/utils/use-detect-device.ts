interface DeviceInfo {
  model: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export const useDetectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("iphone")) {
    if (window.innerHeight === 844 || window.innerHeight === 852) {
      return {
        model: "iPhone 14/13/12",
        width: 550,
        height: 320,
        aspectRatio: 2,
      };
    }
    if (window.innerHeight === 926) {
      return {
        model: "iPhone 14/13/12 Pro Max",
        width: 550,
        height: 320,
        aspectRatio: 2,
      };
    }
    if (window.innerHeight === 812) {
      return {
        model: "iPhone 11",
        width: 550,
        height: 395,
        aspectRatio: 2,
      };
    }
  } else if (userAgent.includes("pixel")) {
    return {
      model: "Google Pixel",
      width: 550,
      height: 320,
      aspectRatio: 2,
    };
  } else if (userAgent.includes("galaxy")) {
    return {
      model: "Samsung Galaxy",
      width: 550,
      height: 320,
      aspectRatio: 2,
    };
  }

  return {
    model: "iPhone 11",
    width: 610,
    height: 395,
    aspectRatio: 0.1,
  };
};
