import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    SafeAreaView,
    StyleSheet,
    Image,
    ImageBackground,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements';

const STORAGE_KEY_TPLevel = '@tapping_power_level';
const STORAGE_KEY_PGLevel = '@passive_gain_level';

const Upgrades = ({ navigation, route }) => {
    // Setting up states
    const [tappingPowerLevel, setTappingPowerLevel] = useState(1);
    const [passiveGainLevel, setPassiveGainLevel] = useState(1);

    const [maxTPLevel, setMaxTPLevel] = useState(false);
    const [maxPGLevel, setMaxPGLevel] = useState(false);

    const [disableTPButton, setTPDisableButton] = useState(false);
    const [disablePGButton, setPGDisableButton] = useState(false);

    const [TPUpgradeText, setTPUpgradeText] = useState("Upgrade");
    const [PGUpgradeText, setPGUpgradeText] = useState("Upgrade");

    const [TPCost, setTPCost] = useState("20");
    const [PGCost, setPGCost] = useState("20");

    const { point } = route.params;
    const [newPoint, setNewPoint] = useState(point);

    const [newTapCount, setNewTapCount] = useState(1);
    const [newTapCountText, setNewTapCountText] = useState(2);

    const [newPassiveGain, setNewPassiveGain] = useState(0);
    const [newPassiveGainText, setNewPassiveGainText] = useState(1);

    const saveTPData = async (tappingPowerLevel) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_TPLevel, toString(tappingPowerLevel));
            console.log("Saving tap lvl " + tappingPowerLevel);

        } catch (message) {
            return console.log(message);
        }
    }

    const savePGData = async (passiveGainLevel) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_PGLevel, toString(passiveGainLevel));
            console.log("Saving passive lvl " + passiveGainLevel);

        } catch (message) {
            return console.log(message);
        }
    }

    // Read data from Async Storage 
    const readTPData = async () => {
        try {
            const TPLevel = await AsyncStorage.getItem(STORAGE_KEY_TPLevel);
            console.log("TPLevel = " + TPLevel);

            return TPLevel

        } catch (e) {
            alert('Failed to fetch the data from storage')
        }
    }

    const readPGData = async () => {
        try {
            const PGLevel = await AsyncStorage.getItem(STORAGE_KEY_PGLevel);
            console.log("PGLevel = " + PGLevel);

            return PGLevel

        } catch (e) {
            alert('Failed to fetch the data from storage')
        }
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         // Upgrades Component DID FOCUS
    //         console.log("Upgrades Component DID FOCUS");
    //         saveTPData(tappingPowerLevel).then(() => {
    //             readTPData().then((TPLevel) => {
    //                 if (typeof TPLevel === "undefined") {
    //                     saveTPData(1).then((tappingPowerLevel) => {
    //                         setTappingPowerLevel(tappingPowerLevel);
    //                     })
    //                     console.log("initialize tap power for the first time");
    //                 } else {
    //                     setTappingPowerLevel(TPLevel);
    //                 }
    //             });
    //         })

    //         savePGData(passiveGainLevel).then(() => {
    //             readPGData().then((PGLevel) => {
    //                 if (typeof PGLevel === "undefined") {
    //                     savePGData(1).then((passiveGainLevel) => {
    //                         setPassiveGainLevel(passiveGainLevel);
    //                     })
    //                     console.log("initialize passive gain for the first time");
    //                 } else {
    //                     setPassiveGainLevel(PGLevel);
    //                 }
    //             })

    //         })

    //         return () => {
    //             // Upgrades Component WILL UN-FOCUS
    //             console.log("Upgrades Component WILL UN-FOCUS");
    //             saveTPData(tappingPowerLevel);
    //             savePGData(passiveGainLevel);
    //         };
    //     }, [])
    // );

    const upgradeTappingPower = () => {
        if (newPoint < TPCost) {
            alert("You don't have enough cookies to buy this upgrade!");
        } else {
            if (tappingPowerLevel != 5) {
                setTappingPowerLevel(tappingPowerLevel + 1)
            }

            if (tappingPowerLevel === 4) {
                setTPDisableButton(true);
                setTPUpgradeText("MAX")
                setNewTapCount(20);
                setMaxTPLevel(true);

            } else if (tappingPowerLevel === 3) {
                setNewTapCount(10);
                setNewTapCountText(20);
                setTPCost(500);

            } else if (tappingPowerLevel === 2) {
                setNewTapCount(5);
                setNewTapCountText(10);
                setTPCost(300);

            } else if (tappingPowerLevel === 1) {
                setNewTapCount(2);
                setNewTapCountText(5);
                setTPCost(100);
            }
            setNewPoint(newPoint - TPCost);
        }
    }

    const upgradePassiveGain = () => {
        if (newPoint < PGCost) {
            alert("You don't have enough cookies to buy this upgrade!");
        } else {
            if (passiveGainLevel != 5) {
                setPassiveGainLevel(passiveGainLevel + 1)
            }

            if (passiveGainLevel === 4) {
                setPGDisableButton(true);
                setPGUpgradeText("MAX");
                setNewPassiveGain(10);
                setMaxPGLevel(true);

            } else if (passiveGainLevel === 3) {
                setNewPassiveGain(5);
                setNewPassiveGainText(10);
                setPGCost(500);

            } else if (passiveGainLevel === 2) {
                setNewPassiveGain(2);
                setNewPassiveGainText(5);
                setPGCost(300);

            } else if (passiveGainLevel === 1) {
                setNewPassiveGain(1);
                setNewPassiveGainText(2);
                setPGCost(100);
            }
            setNewPoint(newPoint - PGCost);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../images/background.jpg')} style={styles.imageBackground} >
                <View style={styles.header}>
                    {/* back button to Cookie */}
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Cookie', {
                        tapCount: newTapCount,
                        point: newPoint,
                        passiveGain: newPassiveGain
                    })}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: 85
                        }}>
                            <Icon
                                name="chevron-left"
                                type="font-awesome-5"
                                size={20}
                                color="white"
                                style={styles.backIcon} />
                            <Text style={styles.backButton}>Back</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.centered}>

                    <Text style={styles.upgradeText}>Upgrade tapping power</Text>
                    <Text style={styles.upgradeDetails}>Level {tappingPowerLevel} / 5</Text>
                    {maxTPLevel ? <></> : <Text style={styles.upgradeDetails}>Cost = {TPCost}</Text>}
                    {maxTPLevel ? <></> : <Text style={styles.description}>Increase tap power by {newTapCountText}</Text>}
                    <TouchableOpacity style={styles.upgradeButton} onPress={upgradeTappingPower} disabled={disableTPButton}>
                        <Text style={styles.text}>{TPUpgradeText}</Text>
                    </TouchableOpacity>

                    <Text style={styles.upgradeText}>Upgrade passive gain</Text>
                    <Text style={styles.upgradeDetails}>Level {passiveGainLevel} / 5</Text>
                    {maxPGLevel ? <></> : <Text style={styles.upgradeDetails}>Cost = {PGCost}</Text>}
                    {maxPGLevel ? <></> : <Text style={styles.description}>Increase passive cookie gain by {newPassiveGainText}</Text>}
                    <TouchableOpacity style={styles.upgradeButton} onPress={upgradePassiveGain} disabled={disablePGButton}>
                        <Text style={styles.text}>{PGUpgradeText}</Text>
                    </TouchableOpacity>
                    <Text style={styles.remainingText}>Cookies remaining: {newPoint}</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}
// stylesheet for the stylings
const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: '#222',
    },
    imageBackground: {
        alignSelf: 'center',
        width: '100%',
        height: '100%'
    },
    centered: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    description: {
        color: 'white',
        fontSize: 15,
        margin: 10,
        alignSelf: "center",
        fontFamily: "fantasy"
    },
    text: {
        color: 'white',
        fontSize: 25,
        margin: 10,
        alignSelf: "center",
        fontFamily: "fantasy"
    },
    upgradeDetails: {
        color: 'white',
        fontSize: 23,
        margin: 5,
        alignSelf: "center",
        fontFamily: "fantasy"
    },
    upgradeText: {
        color: 'white',
        fontSize: 27,
        fontWeight: "bold",
        margin: 10,
        alignSelf: "center",
        fontFamily: "fantasy"
    },
    remainingText: {
        color: 'white',
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 20,
        alignSelf: "center",
        fontFamily: "fantasy",
        backgroundColor: "#225",
        padding: 10,
        borderRadius: 20
    },
    backIcon: {
        alignSelf: 'flex-start',
        marginTop: 2,
        marginLeft: 12
    },
    upgradeButton: {
        width: "40%",
        fontSize: 25,
        color: "white",
        backgroundColor: "#222",
        borderRadius: 10
    },
    backButton: {
        fontSize: 22,
        color: "white",
        marginTop: 8,
        marginLeft: 8,
        marginBottom: 8
    },
})

export default Upgrades;