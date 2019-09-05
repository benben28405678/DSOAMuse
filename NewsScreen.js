/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  Animated,
  Button,
  Dimensions,
} from 'react-native';

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import { WebView } from 'react-native-webview';

import Video from 'react-native-video';
import AnimVideo from "./anim.mp4";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class NewsScreen extends React.Component {

  constructor(props){
    super(props);

    this.load = this.load.bind(this);

    this.state = {
      isLoading: true,
      dataSource: [],
      titles: [],
      fadeAnim: [new Animated.Value(0), new Animated.Value(0)],
    }
  }

  componentDidMount() {
    this.load(1);
  }

  load(post) {
    return fetch('https://www.themuseatdreyfoos.com/wp-json/wp/v2/posts?include[]=' + this.props.navigation.getParam('postNum', 10000))
      .then((response) => response.json())
      .then((responseJson) => {

        Animated.timing(
          this.state.fadeAnim[0],
          {
            toValue: 1,
            delay: 300,
            duration: 500,
          }
        ).start();

        Animated.timing(
          this.state.fadeAnim[1],
          {
            toValue: 1,
            delay: 600,
            duration: 1000,
          }
        ).start();

        this.setState({
          isLoading: false,
          dataSource: responseJson,
          articleTitle: responseJson[0].title.rendered,
          articleBanner: responseJson[0].featured_image_urls.large,
          articleContent: modify(responseJson[0].content.rendered),
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {

    const {navigate} = this.props.navigation;

    if(this.state.isLoading) {
      return (
        <Fragment>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
              <Text>Loading...</Text>
            </SafeAreaView>
          </Fragment>
      );
    }

    return (

      <Fragment>
          <StatusBar barStyle="dark-content">
          </StatusBar>
          <SafeAreaView>
            <ScrollView>

            <View style={styles.container}>
            <Video source={AnimVideo}   // Can be a URL or a local file.
             ref={(ref) => {
               this.player = ref
             }}                                      // Store reference
             onBuffer={this.onBuffer}                // Callback when remote video is buffering
             onError={this.videoError}               // Callback when video cannot be loaded
             />
            </View>

              <Animated.View style={{opacity: this.state.fadeAnim[0]}}>
                <Animated.View style={{opacity: this.state.fadeAnim[1]}}>
                  <View style={styles.bgImageWrapper}>
                    <Image source={{uri: this.state.articleBanner}} style={styles.bgImage}/>
                  </View>
                </Animated.View>
                <Text style={styles.title}>{toTitleCase(this.state.articleTitle)}</Text>
                <Animated.View style={{opacity: this.state.fadeAnim[1]}}>
                  <WebView source={{html: htmlStyle + this.state.articleContent}} style={styles.content}/>
                </Animated.View>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
    );
  }

}

function modify(str) {
  for(var i = 0; i < 100; i++) {
    return str.replace(/<div*?<\/div>/g, '');
  }
}

function toTitleCase(str) {
  if(str == '' || str == null) {
    return;
  }
  str = str.replace("&#8220;", '"')
  str = str.replace("&#8216;", "'")
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return unescapeHTML(txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  );
}

function unescapeHTML(str) {

  if(str == '' || str == null) {
    return;
  }
  var escapeChars = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' };
  str = str.replace(/<\/?[^>]+(>|$)/g, "");
  str = str.replace("&nbsp; ", "");
  return str.replace(/\&([^;]+);/g, function(entity, entityCode) {
    var match;

    if ( entityCode in escapeChars) {
      return escapeChars[entityCode];
    } else if ( match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
      return String.fromCharCode(parseInt(match[1], 16));
    } else if ( match = entityCode.match(/^#(\d+)$/)) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
}

function simpleDate(str) {
  if(str == '' || str == null) {
    return;
  }
  var month = str.slice(5, 7);
  switch(month) {
    case "01": month = "JAN"; break;
    case "02": month = "FEB"; break;
    case "03": month = "MAR"; break;
    case "04": month = "APR"; break;
    case "05": month = "MAY"; break;
    case "06": month = "JUN"; break;
    case "07": month = "JUL"; break;
    case "08": month = "AUG"; break;
    case "09": month = "SEP"; break;
    case "10": month = "OCT"; break;
    case "11": month = "NOV"; break;
    case "12": month = "DEC"; break;
  }

  var day = str.slice(8, 10);

  return month + " " + parseInt(day);
}

const screenWidth = Math.round(Dimensions.get('window').width);

const htmlStyle = '\
<style> \
* { \
  font-size: 42px; \
  font-family: "system font"; \
} \
.Buttons { \
  display: none; \
} \
input { \
  display: none; \
} \
.wp-polls-loading { \
  display: none; \
} \
.slideshowwrap, .remodal-close { \
  display: none; \
} \
a { \
  text-decoration: none; \
  color: #000000; \
} \
img { \
  color: #444444; \
  font-size: 12px; \
} \
input { \
  width: 20px; \
  height: 20px; \
} \
</style> \
'

var styles = StyleSheet.create({
  bgImageWrapper: {
    top: 0, bottom: 0, left: 0, right: 0,
    height: 250,
  },
  bgImage: {
    flex: 1,
    resizeMode: "stretch"
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.black,
    textAlign: 'center',
    padding: 20,
  },
  content: {
    padding: 10,
    margin: 10,
    fontSize: 14,
    height: 5000,
    fontFamily: 'system font'
  },
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
