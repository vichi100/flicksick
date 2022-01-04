import { StyleSheet, Platform, StatusBar } from 'react-native';
export default StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, .9)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
});