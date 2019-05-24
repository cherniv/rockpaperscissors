import Device from '../utils/Device';;

module.exports = {
	toLocaleString: (val) => {
		if (Device.isAndroid) {
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} else {
			return val.toLocaleString();
		}
	}
}