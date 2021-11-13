import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Image,
    Button,
    Alert,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

const dayjs = require('dayjs');
const STORAGE_KEY_UID = '@user_id';
const url = 'https://bclicker-ades-ca3.herokuapp.com';

const Cookie = ({ route, navigation }) => {
    // Setting up states
    const [userId, setUserId] = useState(null);
    const [point, setPoint] = useState(0);
    const [cookieVariant, setCookieVariant] = useState(require('../images/cookie.png'));
    const [spinnerState, setSpinnerState] = useState(false);

    const { tapCount = 1 } = route.params || {};
    const { point: newPoint } = route.params || {};
    const { passiveGain = 0 } = route.params || {};

    // Navigate to upgrades screen
    const buttonPressToUpgrades = () => {
        // Call special function to move to new screen
        navigation.navigate("Upgrades", {
            point: point
        });
    }

    // Change cookie variant when user hit a certain point value
    const changeCookieVariant = () => {
        if (point >= 1000) {
            setCookieVariant(require('../images/cookie-emerald.png'))
        }
        else if (point >= 500) {
            setCookieVariant(require('../images/cookie-diamond.png'))
        }
        else if (point >= 250) {
            setCookieVariant(require('../images/cookie-gold.png'))
        }
        else if (point >= 100) {
            setCookieVariant(require('../images/cookie-sliver.png'))
        }
    }

    // Save UID data into Async Storage
    const saveUID = async (userId) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_UID, userId);
            setUserId(userId);
        } catch (message) {
            return console.log(message);
        }
    }

    // Read data from Async Storage 
    const readData = async () => {
        try {
            const UID = await AsyncStorage.getItem(STORAGE_KEY_UID);

            console.log('UID = ' + UID);
            if (UID !== null) {
                setUserId(UID);
            }

            return UID

        } catch (e) {
            alert('Failed to fetch the data from storage')
        }
    }

    // Clear data from Async Storage 
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear()
            // alert('Storage successfully cleared!')
        } catch (e) {
            alert('Failed to clear the async storage.')
        }
    }

    // Updates every time point changes to change cookie variant
    useEffect(() => {
        changeCookieVariant();
        updateUserPoint(point);
    }, [point])

    // Navigation focused & unfocused
    useFocusEffect(
        // React native life cycle
        useCallback(() => {
            // Cookie Component DID FOCUS
            console.log("Cookie Component DID FOCUS");
            // Read data from async storage
            readData().then((UID) => {
                // Run once to give user an unique UID
                if (UID === null) {
                    setSpinnerState(true);
                    createUser().then(() => {
                        setTimeout(() => {
                            setSpinnerState(false);
                        }, 100);

                        setPoint(0);
                    });
                } else {
                    setSpinnerState(true);
                    getUserInfo(UID).then(() => {
                        setTimeout(() => {
                            setSpinnerState(false);
                        }, 100);
                    });
                }
            })

            // Passive Gain
            const passiveGainInterval = setInterval(() => {
                setPoint(point => point + passiveGain);
            }, 1000);

            // Cookie Component WILL UN-FOCUS
            return () => {
                console.log("Cookie Component WILL UN-FOCUS");
                console.log("passive gain interval cleared");
                clearInterval(passiveGainInterval);
            }
        }, [])
    );

    // Create User 
    const createUser = () => {
        return fetch(`${url}/user`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            response.json().then(responseJson => {
                console.log("Saving UID");
                saveUID(responseJson.userId);
                // console.log(responseJson);
            });
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    // Get User Info 
    const getUserInfo = (UID) => {
        return fetch(`${url}/userInfo?userId=${UID}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            response.json().then(responseJson => {
                setPoint(responseJson.point);
                console.log(responseJson.point);
            });
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    // Update User Info
    const updateUserPoint = (currentPoint) => {
        return fetch(`${url}/point?userId=${userId}&point=${currentPoint}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(function () {
            // console.log("Point updated");
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../images/background.jpg')} style={styles.imageBackground} >
                <View style={styles.header}>
                    <Image source={require('../images/logo.png')} style={styles.logo}></Image>
                </View>

                <View style={styles.centered}>
                    <Spinner
                        visible={spinnerState}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <View style={styles.textHeaderBox}>
                        <Text style={styles.textHeader1}>{point} cookies</Text>
                        <Text style={styles.textHeader2}>per second: {passiveGain}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setPoint(point + tapCount); }} style={styles.touchableCookie}>
                        <Image source={cookieVariant} style={styles.cookie} ></Image>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={buttonPressToUpgrades}>
                        <View style={styles.button}>
                            <Icon
                                name="level-up-alt"
                                type="font-awesome-5"
                                size={80}
                                color="white"
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>UPGRADES</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.textUID}>UID: {userId}</Text>
                    {/* <Button onPress={clearStorage} title="clearStorage" /> */}
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    header: {
        width: '100%',
        backgroundColor: '#222',
    },
    logo: {
        width: 450,
        height: 100,
        alignSelf: 'center',
    },
    imageBackground: {
        alignSelf: 'center',
        width: '100%',
        height: '100%'
    },
    touchableCookie: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 250,
        borderRadius: 160,
        margin: 35
    },
    cookie: {
        height: 250,
        width: 250,
        margin: 50,
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    textHeaderBox: {
        backgroundColor: '#2225',
        padding: 12,
        borderRadius: 20
    },
    textHeader1: {
        fontSize: 30,
        fontWeight: "bold",
        color: 'white',
    },
    textHeader2: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'white',
        alignSelf: "center"
    },
    textUID: {
        fontSize: 15,
        fontWeight: "bold",
        color: 'white',
        marginTop: 10
    },
    button: {
        margin: 10,
        padding: 10,
        width: '50%',
        backgroundColor: '#222',
        borderRadius: 20
    },
    buttonText: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'white',
        fontFamily: "fantasy"
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})

export default Cookie;