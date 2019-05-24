import {Dispatcher} from 'flux';
class AppDispatcher extends Dispatcher{
	dispatch(e){
		super.dispatch(e);
	}
}

export default new AppDispatcher();