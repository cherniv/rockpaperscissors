import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";
import {ROUTES, KEYS} from '../router/Router.config';
const MyNavigator = createSwitchNavigator(ROUTES);

const App = createBrowserApp(MyNavigator);
export default App;