import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Home, About } from '../../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import { COLORS, animate1, animate2, circle1, circle2 } from '../theme';

const Tab = createBottomTabNavigator();

const TabArr = [
    { route: "Home", label: "Inicio", icon: <AntDesign name="home" size={24} color="white" />, component: Home },
    { route: "About", label: "Sobre", icon: <MaterialIcons name="contact-support" size={26} color="white" />, component: About },
];

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;

    const viewRef = useRef(null);
    const circleRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (focused) {
            viewRef.current.animate(animate1);
            circleRef.current.animate(circle1);
            textRef.current.transitionTo({ scale: 1 });
        } else {
            viewRef.current.animate(animate2);
            circleRef.current.animate(circle2);
            textRef.current.transitionTo({ scale: 0 });
        }
    })

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            activeOpacity={1}
        >
            <Animatable.View
                ref={viewRef}
                duration={1000}
                style={styles.container}>
                <View style={[styles.btn, {
                    borderColor: focused ? COLORS.white : COLORS.primary
                }]}>
                    <Animatable.View
                        ref={circleRef}
                        duration={1000}
                        style={styles.circle} />
                    {item.icon}

                </View>
                <Animatable.Text
                    ref={textRef}
                    duration={1000}
                    style={styles.text}>
                    {item.label}
                </Animatable.Text>
            </Animatable.View>

        </TouchableOpacity>
    )
}

const Tabs = () => {
    return (
        
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
        }}>
            {
                TabArr.map((item, index) => {
                    return (
                        <Tab.Screen key={index} name={item.route} component={item.component}
                            options={{
                                tabBarShowLabel:false,
                                tabBarButton: (props) => <TabButton {...props} item={item}/>
                            }}
                        />
                    )
                })
            }

        </Tab.Navigator>
    );
};

export default Tabs;

