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
import { useRegisterMutation } from '../store/userApiSlice';
import { setCredentials } from '../store/authSlice';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { Formik } from 'formik';
import Input from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';
const registerValidationSchema = yup.object().shape({
	firstName: yup.string().required('this field is required'),
	lastName: yup.string().required('this field is required'),
	email: yup
		.string()
		.email('please enter a valid email')
		.required('this field is required'),
	password: yup
		.string()
		.min(6, ({ min }) => `password must be atleast ${min} characters`)
		.required('this field is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'passwords do not match')
		.required('this field is required'),
});
const SignUpScreen = ({ navigation }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const [register] = useRegisterMutation();
	const shakeAnimaRef = useRef();
	const submitHandler = async (firstName, lastName, email, password) => {
		try {
			setLoading(true);
			const data = await register({
				firstName,
				lastName,
				email,
				password,
			}).unwrap();

			dispatch(setCredentials({ user: { ...data } }));
			Toast.show({
				type: 'success',
				text1: 'Successfully Registered!',
				text2: `Welcome ${data.fullName},you can start chatting now`,
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
						firstName: '',
						lastName: '',
						email: '',
						password: '',
						confirmPassword: '',
					}}
					validationSchema={registerValidationSchema}
					onSubmit={(values) =>
						submitHandler(
							values.firstName,
							values.lastName,
							values.email,
							values.password
						)
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
								name='firstName'
								placeholder={'First Name'}
								onChangeText={handleChange('firstName')}
								onBlur={handleBlur('firstName')}
								value={values.firstName}
								keyboardType='default'
								IconPack={Ionicons}
								icon='person'
								errors={errors.firstName}
								touched={touched.firstName}
								autoCapitalize='none'
								autoCorrect={true}
							/>
							<Input
								name='lastName'
								placeholder={'Last Name'}
								onChangeText={handleChange('lastName')}
								onBlur={handleBlur('lastName')}
								value={values.lastName}
								keyboardType='default'
								IconPack={Ionicons}
								icon='person'
								errors={errors.lastName}
								touched={touched.lastName}
								autoCapitalize='none'
								autoCorrect={true}
							/>
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
							<Input
								name='confirmPassword'
								placeholder={'Confirm Password'}
								onChangeText={handleChange('confirmPassword')}
								onBlur={handleBlur('confirmPassword')}
								value={values.confirmPassword}
								keyboardType='default'
								secureTextEntry={showPassword ? false : true}
								iconRight={showPassword ? 'eye' : 'eye-off'}
								IconPack={Ionicons}
								icon='lock-closed'
								onPressIconRight={() => setShowPassword(!showPassword)}
								errors={errors.confirmPassword}
								touched={touched.confirmPassword}
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
										<Text style={styles.buttonText}>Sign Up</Text>
									</TouchableOpacity>
								)}
							</Animatable.View>
						</View>
					)}
				</Formik>

				<Text
					style={{ marginVertical: 15, textAlign: 'center' }}
					onPress={() => navigation.replace('SignInScreen')}
				>
					Have an account already?
					<Text style={{ color: 'red' }}>Sign In</Text>
				</Text>
			</ScrollView>
		</View>
	);
};

export default SignUpScreen;

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
