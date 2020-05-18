import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { useHistory } from 'react-router-native';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/PercenatageFix';
// import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import Firebase, { db } from '../../config/Firebase';
// import uuid from "react-native-uuid";

const MentorItem = ({ submitHandler }) => {
	const history = useHistory();

	// const [date, setDate] = useState(Date());
	const [ events, setEvents ] = useState([]);
	// const [ mentor, setMentor ] = useState('');
	// const [ time, setTime ] = useState();
	// const [ year, setYear ] = useState('');
	// const [ day, setDay ] = useState('');
	// const [ month, setMonth ] = useState('');
  // const [ title, setTitle ] = useState('');
  let time = "";
  let mentor = "";
  let year = "";
  let month = "";
  let day = "";
	const [ agendaItems, setAgendaItems ] = useState({});
	// const [ id, setId ] = useState('');

	const mockSubmit = () => {
		submitHandler(year, month, day, time, mentor);
		history.replace('/calendar/agenda');
	};

	// const _getStorageValue = async () => {
	// 	const uid = await AsyncStorage.getItem('UID');
	//   let newData = [];

	//   db.collection('meetings').where('participantUIDs', 'array-contains', uid)
	// 		.onSnapshot((querySnapshot) => {
	// 			const arr = []
	// 			querySnapshot.forEach((doc) => {
	// 				if (doc.data()) {
	// 					arr.push(doc.data())
	// 				}
	// 			})
	// 			console.log("YOUR MOMS ARRAY", arr);
	// 		querySnapshot.forEach((doc) => {
	//       // console.log(doc.data())
	// 			const start = doc.data().start.seconds * 1000;
	// 			setTitle(doc.data().title);
	// 			setMentor(doc.data().participantNames[0]);
	// 			const start2 = new Date(start);
	// 			const myDate = start2.toJSON().split('T')[0].split('-');
	// 			setYear(myDate[0]);
	// 			setMonth(myDate[1]);
	// 			setDay(myDate[2]);

	// 			const myTime = start2.toJSON().split('T')[1];
	// 			var dt = moment(myTime, [ 'hh:mm:ss.SSSZ' ]).format('hh:mm A');
	// 			setTime(dt);
	// 			setId(doc.data().id);

	// 			const date = `${year}-${month}-${day}`;
	// 			const meetingText = `Meeting with ${mentor} at ${time}`;
	//       setAgendaItems({
	// 				[date]: [ { id: id, text: meetingText } ]
	// 			});
	// 			// console.log('agendaItems:', agendaItems);

	// 			newData.push({
	// 				title: doc.data().title,
	// 				start: new Date(start),
	// 				id: doc.data().id,
	// 				mentor: doc.data().participantNames[0]
	// 				// date: date,
	// 			});
	// 			setEvents(newData);
	// 		});
	// 	});
	// };

	const formatData = (arr) => {
		let newData = [];
		arr.map((doc) => {
      const start = doc.start.seconds * 1000;
      const start2 = new Date(start);
      // Does not update properly
      const myDate = start2.toJSON().split('T')[0].split('-');
			// setYear(myDate[0]);
			// setMonth(myDate[1]);
      // setDay(myDate[2]);
      // console.log(myDate[0],myDate[1],myDate[2]);
			// setTitle(doc.title);
			// setMentor(doc.participantNames[0]);
			// setId(doc.id);

			const myTime = start2.toJSON().split('T')[1];
			var dt = moment(myTime, [ 'hh:mm:ss.SSSZ' ]).format('hh:mm A');
			// setTime(dt);
      year = myDate[0];
      month = myDate[1];
      day = myDate[2];
      time = dt;
      mentor = doc.participantNames[0];
      const date = `${myDate[0]}-${myDate[1]}-${myDate[2]}`;
      // console.log("date", date)
			const meetingText = `Meeting with ${doc.participantNames[0]} at ${dt}`;
			// setAgendaItems({
			//   ...agendaItems,
			//   [date]: [{ id: id, text: meetingText }]
			// });
			// console.log('agendaItems:', agendaItems);

			newData.push({
				title: doc.title,
				start: new Date(start),
				id: doc.id,
        mentor: doc.participantNames[0],
        // not updating
				date: date,
        meetingText: meetingText,
        time: dt
			});
		});
		const newArr = [];
		newData.map((item) => {
			newArr.push({ [item.date]: [ { id: item.id, text: item.meetingText } ] });
		});
		setAgendaItems(newArr);
		setEvents(newData);
    // console.log('YES MOM', agendaItems, 'NO MOM', events);

    // Attempt at async storage
      // saveEvent(agendaItems);
      // console.log("getEvent", getEvent());
	};

	const _getStorageValue = async () => {
		const uid = await AsyncStorage.getItem('UID');
		db.collection('meetings').where('participantUIDs', 'array-contains', uid).onSnapshot((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				if (doc.data()) {
					arr.push(doc.data());
				}
			});
			formatData(arr);
		});
	};
// Attempt at AsyncStorage
  // const saveEvent = async agendaItems => {
  //   try {
  //     await AsyncStorage.setItem('noteCalendarStorage', agendaItems);
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log(error.message);
  //   }
  // };

  // const getEvent = async () => {
  //   let event = '';
  //   try {
  //     agendaItems = await AsyncStorage.getItem('noteCalendarStorage') || 'none';
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log(error.message);
  //   }
  //   return event;
  // }

	useEffect(() => {
		_getStorageValue();
		console.log("YES MOM", agendaItems, "NO MOM", events);
	}, []);

	return (
		<View>
			<View style={styles.itemView}>
				<Text style={styles.itemText}>Sync</Text>
				<Text style={styles.button} onPress={mockSubmit}>
					+Sync+
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		padding: 15,
		backgroundColor: '#f8f8f8',
		borderBottomWidth: 1,
		borderColor: '#eee',
		fontSize: 25
	},
	container: {
		height: 650,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		margin: 20
	},
	modal: {
		width: 200
	},
	button: {
		textAlign: 'center',
		fontSize: 30,
		padding: 10,
		width: 150,
		borderRadius: 20,
		borderColor: 'black'
	},
	input: {
		margin: 20
	},
	itemView: {
		maxHeight: heightPercentageToDP('4%'),
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'space-around',
		marginRight: widthPercentageToDP('2%'),
		marginTop: heightPercentageToDP('8%'),
		flexDirection: 'row'
	},
	itemText: {
		fontSize: 18
	}
});
export default MentorItem;
