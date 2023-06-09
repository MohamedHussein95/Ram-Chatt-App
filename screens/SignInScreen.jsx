import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {
	ActivityIndicator,
	Button,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../store/userApiSlice';
import { setCredentials } from '../store/authSlice';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { Formik } from 'formik';
import Input from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';

const SignInValidationSchema = yup.object().shape({
	email: yup
		.string()
		.email('please enter a valid email')
		.required('this field is required'),
	password: yup.string().required('this field is required'),
});

const SignInScreen = ({ navigation }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const [login] = useLoginMutation();
	const shakeAnimaRef = useRef();
	const submitHandler = async (email, password) => {
		try {
			setLoading(true);
			const data = await login({
				email,
				password,
			}).unwrap();

			dispatch(setCredentials({ user: { ...data } }));
			Toast.show({
				type: 'success',
				text1: 'Signed In',
				text2: `Start Chatting`,
				position: 'bottom',
			});
		} catch (error) {
			setLoading(false);
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'bottom',
			});
		}
	};

	return (
		<View style={styles.screen}>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					justifyContent: 'center',
				}}
			>
				<Text style={styles.title}>Ram Chatt</Text>
				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					validationSchema={SignInValidationSchema}
					onSubmit={(values) =>
						submitHandler(values.email, values.password)
					}
				>
					{({
						handleChange,
						handleBlur,
						handleReset,
						handleSubmit,
						values,
						errors,
						touched,
						isValid,
					}) => (
						<View style={styles.formContainer}>
							<Input
								name='email'
								placeholder={'Email Adress'}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								value={values.email}
								keyboardType='email-address'
								IconPack={Ionicons}
								icon='mail'
								errors={errors.email}
								touched={touched.email}
								autoCapitalize='none'
								autoCorrect={true}
							/>
							<Input
								name='password'
								placeholder={'password'}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								value={values.password}
								keyboardType='default'
								secureTextEntry={showPassword ? false : true}
								iconRight={showPassword ? 'eye' : 'eye-off'}
								IconPack={Ionicons}
								icon='lock-closed'
								onPressIconRight={() => setShowPassword(!showPassword)}
								errors={errors.password}
								touched={touched.password}
								autoCapitalize='none'
								autoCorrect={false}
							/>

							<Animatable.View
								ref={shakeAnimaRef}
								style={styles.buttonContainer}
							>
								{loading ? (
									<View style={styles.button}>
										<ActivityIndicator
											size={'small'}
											color={Colors.white}
										/>
									</View>
								) : (
									<TouchableOpacity
										activeOpacity={0.8}
										//disabled={!isValid}
										style={styles.button}
										onPress={() => {
											if (!isValid) {
												shakeAnimaRef.current.shake(800);
											} else {
												handleSubmit();
											}
										}}
									>
										<Text style={styles.buttonText}>Sign In</Text>
									</TouchableOpacity>
								)}
							</Animatable.View>
						</View>
					)}
				</Formik>

				<Text
					style={{ marginVertical: 15, textAlign: 'center' }}
					onPress={() => navigation.replace('SignUpScreen')}
				>
					Don't Have an account?
					<Text style={{ color: 'red' }}>Sign Up</Text>
				</Text>
			</ScrollView>
		</View>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	formContainer: {
		flex: 1,
		justifyContent: 'center',
		gap: 10,
		marginTop: 20,
	},

	title: {
		fontSize: 36,
		fontWeight: '800',
		letterSpacing: 3.5,
		marginTop: 50,
		color: Colors.primary,
		alignSelf: 'center',
	},

	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.primary,
		alignSelf: 'center',
		width: '90%',
		marginVertical: 15,
		borderRadius: 8,
		overflow: 'hidden',
	},
	button: {
		flex: 1,
		height: 50,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 18,
		color: Colors.white,
	},
});
