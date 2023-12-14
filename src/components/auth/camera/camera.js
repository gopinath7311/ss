import React, {Component} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import MaskedView from '@react-native-masked-view/masked-view';
import auth from '../../../services/authService';
const {width: windowWidth} = Dimensions.get('window');

import * as FaceDetector from 'expo-face-detector';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RNCamera} from 'react-native-camera';
import {Icon} from 'react-native-elements';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import LinearGradient from 'react-native-linear-gradient';
const PREVIEW_SIZE = 325;
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};
class Camera extends Component {
  state = {
    camera: null,
    isCameraOpen: true,
    img: '',
    hasPermission: false,
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'front', // Camera Front or Back
    whiteBalance: 'auto',
    ratio: '16:9',
    canDetectFaces: false,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    blinkDetected: false,
    blinkedimage: null,
    circleProgress: 0,
    smiled: false,
    eyeblink: false,
    note1:'Blink your eyes',
    note2:''
  };
  async componentDidMount() {}
 

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      // console.warn('takePicture ', data.uri);
      this.setState({img: data.uri});
    }
  };

  facesDetected = ({faces}) => {
    const rightEye = faces[0].rightEyeOpenProbability;
    const leftEye = faces[0].leftEyeOpenProbability;
    const smileprob = faces[0].smilingProbability;
    const bothEyes = (rightEye + leftEye) / 2;

    // console.log(
    //   JSON.stringify({
    //     // rightEyeOpenProbability: rightEye,
    //     // leftEyeOpenProbability: leftEye,
    //     //smilingProbability: smileprob,
    //     //blinkProb: bothEyes,
    //   }),
    // );
   
    if (bothEyes <= 0.3) {
      // console.log(
      //   JSON.stringify({
      //     blinkDetected: 'blinkDetected',
      //     rightEyeOpenProbability: rightEye,
      //     leftEyeOpenProbability: leftEye,
      //   }),
      // );
      this.setState({blinkDetected: true});
    }
    if (this.state.blinkDetected && bothEyes >= 0.9) {
      // this.takePicture(faces);
      this.setState({
        blinkDetected: false,
        circleProgress: 50,
        eyeblink:true,
        note1:"Now smile"
      });
      
    }
    if (smileprob > 0.25 &&this.state.eyeblink) {
      this.setState({
        circleProgress: this.state.circleProgress + 50,
        smiled: true,
      });
    }
    this.setState({faces});
    if(this.state.smiled && this.state.eyeblink){
      this.takePicture(faces);
    }
  };

  cancel = () => {
    this.setState({img: '',circleProgress:0,smiled:false,eyeblink:false,note1:"Blink your eyes"});
  };
  capturePhoto=async()=>{
Alert.alert("ok ok upload chesta")
  }
  render() {
    const {img,eyeblink,smiled} = this.state;

    return (
      <LinearGradient
              colors={['#1d8659', '#3f777d', '#5c6b9e']}
              start={{x: 0.2, y: 0.2}}
              end={{x: 1, y: 0.2}}
              style={{flex:1}}>
        <View   style={{alignSelf: 'flex-start', left: 10, top: 10}}>
       <TouchableOpacity
        
          onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" type="ionicons" size={35} color="black" />
        </TouchableOpacity>
        </View>
        <MaskedView
          //style={StyleSheet.absoluteFill}
          maskElement={<View style={styles.mask} />}>
            {img.length > 0 ? 
          <View>
            <Image
              style={styles.circularProgress}
              source={{uri: img}}
            />
            </View>
         :
          <RNCamera
            ref={ref => (this.camera = ref)}
            //style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.off}
            mirrorImage={true}
            fixOrientation={true}
            zoom={this.state.zoom}
            ratio={this.state.ratio}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks
                ? RNCamera.Constants.FaceDetection.Landmarks.all
                : undefined
            }
            faceDetectionClassifications={
              RNCamera.Constants.FaceDetection.Classifications.all
                ? RNCamera.Constants.FaceDetection.Classifications.all
                : undefined
            }
            onCameraReady={() => {
              // console.log('onCameraReady');
              this.setState({canDetectFaces: true});
            }}
            onFacesDetected={
              this.state.canDetectFaces ? this.facesDetected : null
            }
            onFaceDetectionError={error => console.log('FDError', error)} // This is never triggered
          >
            <AnimatedCircularProgress
              style={styles.circularProgress}
              size={PREVIEW_SIZE}
              width={5}
              backgroundWidth={7}
              fill={this.state.circleProgress}
              tintColor="#3485FF"
              backgroundColor="#e8e8e8"
            />
          </RNCamera>}
        </MaskedView>
        <View style={styles.instructionsContainer}>
          {eyeblink && smiled ? (
            <View>
              <Text style={[styles.action, {color: '#0f2d24'}]}>Success</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.instructions}>
                <Text style={{color: 'red'}}>*<Text style={{color:"#fff"}}>{this.state.note1}</Text></Text>
              </Text>
              <Text style={styles.action}>To capture selfie</Text>
            </View>
          )}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
          disabled={!smiled&&!eyeblink}
            style={[styles.takebtn]}
            onPress={() => this.capturePhoto()}>
            <Text style={{color: 'white', fontFamily: 'YoungSerif-Regular'}}>
              Upload
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.takebtn, {backgroundColor: 'red', left: 30}]}
            onPress={() => this.cancel()}>
            <Text style={{color: 'white', fontFamily: 'YoungSerif-Regular'}}>
              Cancel
            </Text>
          </TouchableOpacity>
          
        </View>
        </LinearGradient>
    );
  }
}

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  preview: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    top: 70,
    borderRadius: 150,
    overflow: 'hidden',
  },
  takebtn: {
    alignSelf: 'center',
    backgroundColor: '#4cc44a',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    right: 30,
  },
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX,
  },
  instructions: {
    fontSize: 20,
    top: 25,
    position: 'absolute',
    alignSelf: 'center',
  },
  instructionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE,
    top:20
  },
  action: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   TouchableOpacity,
//   Slider,
//   TouchableWithoutFeedback,
//   Dimensions,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';

// const flashModeOrder = {
//   off: 'on',
//   on: 'auto',
//   auto: 'torch',
//   torch: 'off',
// };

// const wbOrder = {
//   auto: 'sunny',
//   sunny: 'cloudy',
//   cloudy: 'shadow',
//   shadow: 'fluorescent',
//   fluorescent: 'incandescent',
//   incandescent: 'auto',
// };

// const landmarkSize = 2;

// export default class Camera extends React.Component {
//   state = {
//     flash: 'off',
//     zoom: 0,
//     autoFocus: 'on',
//     autoFocusPoint: {
//       normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
//       drawRectPosition: {
//         x: Dimensions.get('window').width * 0.5 - 32,
//         y: Dimensions.get('window').height * 0.5 - 32,
//       },
//     },
//     depth: 0,
//     type: 'front', // Camera Front or Back
//     whiteBalance: 'auto',
//     ratio: '16:9',
//     canDetectFaces: false,
//     canDetectText: false,
//     canDetectBarcode: false,
//     faces: [],
//     blinkDetected: false,
//     blinkedimage: null,
//   };

//   touchToFocus(event) {
//     const {pageX, pageY} = event.nativeEvent;
//     const screenWidth = Dimensions.get('window').width;
//     const screenHeight = Dimensions.get('window').height;
//     const isPortrait = screenHeight > screenWidth;

//     let x = pageX / screenWidth;
//     let y = pageY / screenHeight;
//     // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
//     if (isPortrait) {
//       x = pageY / screenHeight;
//       y = -(pageX / screenWidth) + 1;
//     }

//     this.setState({
//       autoFocusPoint: {
//         normalized: {x, y},
//         drawRectPosition: {x: pageX, y: pageY},
//       },
//     });
//   }

//   setFocusDepth(depth) {
//     this.setState({
//       depth,
//     });
//   }

//   takePicture = async function () {
//     if (this.camera) {
//       const data = await this.camera.takePictureAsync();
//       console.warn('takePicture ', data);
//       this.setState({blinkedimage: data.path});
//     }
//   };

//   toggle = value => () => {
//     this.setState(prevState => ({[value]: !prevState[value]}));
//     console.log(value, this.state[`${value}`]);
//   };

//   facesDetected = ({faces}) => {
//     const rightEye = faces[0].rightEyeOpenProbability;
//     const leftEye = faces[0].leftEyeOpenProbability;
//     const smileprob = faces[0].smilingProbability;
//     const bothEyes = (rightEye + leftEye) / 2;
//     // console.log(
//     //   JSON.stringify({
//     //     rightEyeOpenProbability: rightEye,
//     //     leftEyeOpenProbability: leftEye,
//     //     smilingProbability: smileprob,
//     //     blinkProb: bothEyes,
//     //   }),
//     // );
//     if (bothEyes <= 0.3) {
//       console.log(
//         JSON.stringify({
//           blinkDetected: 'blinkDetected',
//           rightEyeOpenProbability: rightEye,
//           leftEyeOpenProbability: leftEye,
//         }),
//       );
//       this.setState({blinkDetected: true});
//     }
//     if (this.state.blinkDetected && bothEyes >= 0.9) {
//       this.takePicture(faces);
//       this.setState({blinkDetected: false});
//     }
//     this.setState({faces});
//   };

//   renderFace = ({
//     bounds,
//     faceID,
//     rollAngle,
//     yawAngle,
//     leftEyeOpenProbability,
//     rightEyeOpenProbability,
//     smilingProbability,
//   }) => (
//     <View
//       key={faceID}
//       transform={[
//         {perspective: 600},
//         {rotateZ: `${rollAngle.toFixed(0)}deg`},
//         {rotateY: `${yawAngle.toFixed(0)}deg`},
//       ]}
//       style={[
//         styles.face,
//         {
//           ...bounds.size,
//           left: bounds.origin.x,
//           top: bounds.origin.y,
//         },
//       ]}>
//       <Text style={styles.faceText}>ID: {faceID}</Text>
//       <Text style={styles.faceText}>
//         eyeOpenProbability:
//         {leftEyeOpenProbability + rightEyeOpenProbability / 2}
//       </Text>
//       <Text style={styles.faceText}>
//         smilingProbability: {smilingProbability}
//       </Text>
//     </View>
//   );

//   renderLandmarksOfFace(face) {
//     const renderLandmark = position =>
//       position && (
//         <View
//           style={[
//             styles.landmark,
//             {
//               left: position.x - landmarkSize / 2,
//               top: position.y - landmarkSize / 2,
//             },
//           ]}
//         />
//       );
//     return (
//       <View key={`landmarks-${face.faceID}`}>
//         {renderLandmark(face.leftEyePosition)}
//         {renderLandmark(face.rightEyePosition)}
//         {renderLandmark(face.leftEarPosition)}
//         {renderLandmark(face.rightEarPosition)}
//         {renderLandmark(face.leftCheekPosition)}
//         {renderLandmark(face.rightCheekPosition)}
//         {renderLandmark(face.leftMouthPosition)}
//         {renderLandmark(face.mouthPosition)}
//         {renderLandmark(face.rightMouthPosition)}
//         {renderLandmark(face.noseBasePosition)}
//         {renderLandmark(face.bottomMouthPosition)}
//       </View>
//     );
//   }

//   renderFaces = () => (
//     <View style={styles.facesContainer} pointerEvents="none">
//       {this.state.faces.map(this.renderFace)}
//     </View>
//   );

//   renderLandmarks = () => (
//     <View style={styles.facesContainer} pointerEvents="none">
//       {this.state.faces.map(this.renderLandmarksOfFace)}
//     </View>
//   );

//   renderCamera() {
//     const {canDetectFaces} = this.state;

//     const drawFocusRingPosition = {
//       top: this.state.autoFocusPoint.drawRectPosition.y - 32,
//       left: this.state.autoFocusPoint.drawRectPosition.x - 32,
//     };
//     // handleFaceDetected = faceArray => {
//     //   console.log('handleFaceDetected', faceArray);
//     // };
//     return (
//       <RNCamera
//         ref={ref => {
//           this.camera = ref;
//         }}
//         style={{
//           flex: 1,
//           justifyContent: 'space-between',
//         }}
//         type={this.state.type}
//         zoom={this.state.zoom}
//         ratio={this.state.ratio}
//         androidCameraPermissionOptions={{
//           title: 'Permission to use camera',
//           message: 'We need your permission to use your camera',
//           buttonPositive: 'Ok',
//           buttonNegative: 'Cancel',
//         }}
//         faceDetectionLandmarks={
//           RNCamera.Constants.FaceDetection.Landmarks
//             ? RNCamera.Constants.FaceDetection.Landmarks.all
//             : undefined
//         }
//         faceDetectionClassifications={
//           RNCamera.Constants.FaceDetection.Classifications.all
//             ? RNCamera.Constants.FaceDetection.Classifications.all
//             : undefined
//         }
//         onCameraReady={() => {
//           console.log('onCameraReady');
//           this.setState({canDetectFaces: true});
//         }}
//         onFacesDetected={this.state.canDetectFaces ? this.facesDetected : null}
//         onFaceDetectionError={error => console.log('FDError', error)} // This is never triggered
//       >
//         <View
//           style={{
//             flex: 0.5,
//             height: 72,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//           }}>

//         </View>

//         <View style={{bottom: 0}}>
//           <View
//             style={{
//               height: 56,
//               backgroundColor: 'transparent',
//               flexDirection: 'row',
//               alignSelf: 'flex-end',
//             }}>
//             <TouchableOpacity
//               style={[
//                 styles.flipButton,
//                 styles.picButton,
//                 {flex: 0.3, alignSelf: 'flex-end'},
//               ]}
//               onPress={this.takePicture.bind(this)}>
//               <Text style={styles.flipText}> SNAP </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* {this.renderFaces()} */}
//         {/* {canDetectFaces && this.renderLandmarks()} */}
//       </RNCamera>
//     );
//   }

//   render() {
//     return <View style={styles.container}>{this.renderCamera()}</View>;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: '#000',
//   },
//   flipButton: {
//     flex: 0.3,
//     height: 40,
//     marginHorizontal: 2,
//     marginBottom: 10,
//     marginTop: 10,
//     borderRadius: 8,
//     borderColor: 'white',
//     borderWidth: 1,
//     padding: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   autoFocusBox: {
//     position: 'absolute',
//     height: 64,
//     width: 64,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'white',
//     opacity: 0.4,
//   },
//   flipText: {
//     color: 'white',
//     fontSize: 15,
//   },
//   zoomText: {
//     position: 'absolute',
//     bottom: 70,
//     zIndex: 2,
//     left: 2,
//   },
//   picButton: {
//     backgroundColor: 'darkseagreen',
//   },
//   facesContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     left: 0,
//     top: 0,
//   },
//   face: {
//     padding: 10,
//     borderWidth: 2,
//     borderRadius: 2,
//     position: 'absolute',
//     borderColor: '#FFD700',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   landmark: {
//     width: landmarkSize,
//     height: landmarkSize,
//     position: 'absolute',
//     backgroundColor: 'red',
//   },
//   faceText: {
//     color: '#FFD700',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     margin: 10,
//     backgroundColor: 'transparent',
//   },
//   text: {
//     padding: 10,
//     borderWidth: 2,
//     borderRadius: 2,
//     position: 'absolute',
//     borderColor: '#F00',
//     justifyContent: 'center',
//   },
//   textBlock: {
//     color: '#F00',
//     position: 'absolute',
//     textAlign: 'center',
//     backgroundColor: 'transparent',
//   },
// });
