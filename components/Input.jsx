import React, { memo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';
const Input = ({
	IconPack,
	icon,
	iconRight,
	active,
	color,
	containerStyle,
	inputStyle,
	inputContainer,
	touched,
	errors,
	onPressIconRight,
	onPressIconLeft,
	...props
}) => {
	return (
		<View style={{ ...styles.container, ...containerStyle }}>
			<View
				style={[
					styles.inputContainer,
					inputContainer,
					{
						borderColor:
							errors && touched ? Colors.error : Colors.primary500,
						borderWidth: active ? 1 : errors && touched ? 1 : 0,
					},
				]}
			>
				{IconPack && (
					<IconPack
						name={icon}
						size={props.size || 24}
						color={errors && touched ? Colors.error : Colors.greyScale400}
						onPress={onPressIconLeft}
						style={[styles.icon, props.iconStyle]}
					/>
				)}
				<TextInput
					{...props}
					style={[styles.inputs, props.inputStyle]}
					placeholderTextColor={Colors.greyScale500}
					cursorColor={Colors.greyScale700}
				/>
				{IconPack && (
					<IconPack
						name={iconRight}
						size={props.size || 24}
						color={errors && touched ? Colors.error : Colors.greyScale400}
						onPress={onPressIconRight}
						style={[styles.icon, props.iconStyle]}
					/>
				)}
			</View>

			<View style={[styles.inputInfo]}>
				{errors && touched && (
					<View style={[styles.errorContainer]}>
						<Text style={[styles.errorText]}>{errors}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	inputs: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 10,
		width: '100%',
		fontSize: 18,
		color: Colors.greyScale900,
		height: '100%',
	},
	inputContainer: {
		height: 60,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		width: '90%',
		alignSelf: 'center',
		backgroundColor: Colors.greyScale100,
	},
	container: {},
	errorText: { color: Colors.error },
	errorContainer: { alignSelf: 'center' },
	icon: {},
	inputInfo: {
		flexDirection: 'row',
		width: '90%',
		alignSelf: 'center',
	},
});
