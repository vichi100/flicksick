import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { ParallaxImage } from "../react-native-snap-carousel/index";
import styles from "../styles/SliderEntry.style";

// https://snack.expo.io/@vichi/45c79d   image overlay text

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
  };

  get image() {
    const {
      data: { illustration },
      parallax,
      parallaxProps,
      even,
    } = this.props;

    return false ? (
      <View
        style={{
          flex: 1,
          alignItems: "stretch",
          justifyContent: "center",
          paddingTop: 90,
          backgroundColor: "#ecf0f1",
        }}
      >
        <ParallaxImage
          source={{ uri: illustration }}
          dataText={"vichi"}
          containerStyle={[
            styles.imageContainer,
            even ? styles.imageContainerEven : {},
          ]}
          style={styles.image}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={
            even ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.25)"
          }
          {...parallaxProps}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Your overlay text</Text>
        </View>
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          alignItems: "stretch",
          justifyContent: "center",
          // paddingTop: 90,
          backgroundColor: "#ecf0f1",
        }}
      >
        <Image source={{ uri: illustration }} style={{ flexGrow: 1 }} />
      </View>
    );
  }

  render() {
    const {
      data: { title, subtitle },
      even,
    } = this.props;

    const uppercaseTitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        {title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          alert(`You've clicked '${title}'`);
        }}
      >
        {/* <View style={styles.shadow} /> */}
        <View
          style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        >
          {this.image}

          <View
            style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]}
          />
        </View>

        {/* <View
          style={[styles.textContainer, even ? styles.textContainerEven : {}]}
        >
          {uppercaseTitle}
          <Text
            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View> */}
      </TouchableOpacity>
    );
  }
}
