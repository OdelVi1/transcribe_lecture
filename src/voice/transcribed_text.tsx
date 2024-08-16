import React, { Component } from 'react';
import { Text } from 'react-native';

type Props = {
  segment_time: string;
  original_text: string;
};

export class TranscribedText extends Component<Props> {
    constructor(props: Props) {
        super(props)
        console.log("TranscribedText Created with ", this.props.original_text, this.props.segment_time);
        this.state = {
            server_text: "",
            original_text_selected: true,
        };
        this._setTextBestVersion();
    }

//     _getTextBestVersion(text: TranscribedText) {
//             // POST request using fetch with async/await
//             const requestOptions = {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     text: text.getOriginalText(),
//                     segment_time: text.getSegmentTime(),
//                     course_id: this.props.notebook_id})
//             };
//             const response = fetch('http://192.168.96.139:5000/best_version', requestOptions);
//             const data = response.json();
//             console.log("Got server text with id: ", data.id, data)
//             TranscribedText.setServerText(data.id);
//         }

    _setTextBestVersion() {
            // POST request using fetch with async/await
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: this.getOriginalText(),
                    segment_time: this.getSegmentTime(),
                    course_id: 'yy'})
            };
            console.log("try to fetch server text");
            fetch('http://127.0.0.1:5000/best_version', options)
              .then(response => response.text())
              .then(data => {console.log("got server best text result: ", data); this.setServerText(data);})
              .catch(error => console.error("server best text fetch error: ", error));
        }

    getOriginalText = () => {
        return this.props.original_text;
    }

    getServerText = () => {
            return this.state.server_text;
        }

    getSegmentTime = () => {
        return this.props.segment_time;
    }

    setServerText = (text: string) => {
        this.setState({
            server_text: text,
            original_text_selected: false
        });
    }

    selectOriginalText = () => {
        this.setState({
            original_text_selected: true
        });
    }

    selectServerText = () => {
        this.setState({
            original_text_selected: false
        });
    }

//     async componentDidMount() {
//         // POST request using fetch with async/await
//         const requestOptions = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                             text: this.props.original_text,
//                             segment_time: this.props.segment_time,
//                             course_id: 'xx'})
//         };
//         const response = await fetch('http://10.0.0.7:5000/best_version', requestOptions);
//         const data = await response.json();
//         setServerText(data);
//         console.log("TranscribedText Text changed to ", this.props.server_text_text, this.props.segment_time);
//     }

    render(){
        return(
            <Text key={this.props.original_text}>
                {this.state.original_text_selected ? this.props.original_text : this.state.server_text}
            </Text>
        );
    }
}
// export default TranscribedText;