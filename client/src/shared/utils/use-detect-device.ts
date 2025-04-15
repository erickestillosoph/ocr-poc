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
        width: window.innerWidth - 20,
        height: 752,
        aspectRatio: 0.5,
      };
    }
    if (window.innerHeight === 926) {
      return {
        model: "iPhone 14/13/12 Pro Max",
        width: window.innerWidth - 20,
        height: 792,
        aspectRatio: 0.5,
      };
    }
    if (window.innerHeight === 812) {
      return {
        model: "iPhone 11",
        width: window.innerWidth - 20,
        height: 872,
        aspectRatio: 0.5,
      };
    }
  }

  if (userAgent.includes("pixel")) {
    return {
      model: "Google Pixel",
      width: window.innerWidth - 20,
      height: Math.floor(window.innerWidth * 1.7),
      aspectRatio: 0.47,
    };
  }

  return {
    model: "Unknown Device",
    width: window.innerWidth - 50,
    height: Math.floor(window.innerWidth * 0.5),
    aspectRatio: 0.1,
  };
};
