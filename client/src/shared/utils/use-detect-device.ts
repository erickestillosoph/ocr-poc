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
        width: 300,
        height: 600,
        aspectRatio: 2,
      };
    }
    if (window.innerHeight === 926) {
      return {
        model: "iPhone 14/13/12 Pro Max",
        width: 300,
        height: 600,
        aspectRatio: 2,
      };
    }
    if (window.innerHeight === 812) {
      return {
        model: "iPhone 11",
        width: 300,
        height: 600,
        aspectRatio: 2,
      };
    }
  } else if (userAgent.includes("pixel")) {
    return {
      model: "Google Pixel",
      width: 300,
      height: 600,
      aspectRatio: 2,
    };
  } else if (userAgent.includes("galaxy")) {
    return {
      model: "Samsung Galaxy",
      width: 300,
      height: 600,
      aspectRatio: 2,
    };
  }

  return {
    model: "Unknown Device",
    width: 300,
    height: 600,
    aspectRatio: 0.1,
  };
};
