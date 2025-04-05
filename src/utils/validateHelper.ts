export const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^[0-9]{8,11}$/;
    if (value) {
      if (!phoneRegex.test(value)) {
        return Promise.reject('Vui lòng nhập số với độ dài 8-11 ký tự');
      }
    }
  
    return Promise.resolve();
  };