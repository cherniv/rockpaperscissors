import { AppRegistry } from "react-native";
import App from './app'
console.log('AAAAAAAAA')
AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root")
});
