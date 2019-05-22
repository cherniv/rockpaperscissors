import {Dispatcher} from 'flux';
class AppDispatcher extends Dispatcher{
	dispatch(e){
		super.dispatch(e);
	}
}

module.exports = new AppDispatcher();