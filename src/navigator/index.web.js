import { createSwitchNavigator, NavigationActions, StackActions } from "@react-navigation/core";
import { createBrowserApp , Link} from "@react-navigation/web";
import {ROUTES, KEYS} from '../router/Router.config';
const MyNavigator = createSwitchNavigator(ROUTES);
const App = createBrowserApp(MyNavigator);
export {NavigationActions, StackActions , Link};
export default App;