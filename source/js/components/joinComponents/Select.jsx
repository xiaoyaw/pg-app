var React = require('react');
import {
	Link
} from 'react-router';
import {
	hashHistory
} from 'react-router';
var Select = React.createClass({
	getInitialState: function() {
		return {
			usnClick: true,
			clnClick: false,
			flnClick: false,
			course: [],
			usn: [],
			cln: [],
			displayFile: []
		};
	},
	componentDidMount: function() {
		if (this.isMounted()) {
			var that = this;
			this.queryAllLiv();
			this.handleSearch();
			this.handleSelect();
			$('#toread').on('click', function() {

				if (that.state.flnClick) {
					var res = that.catchValue();
					if (res != undefined) {
						hashHistory.replace('/eread/' + res);
					}
				} else {
					hashHistory.replace('/eread/' + $('#liv_select').val().split('.')[0]);
				}
			});
			$(document).keydown(function(e) {
				var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
				if (eCode == "13") { //keyCode=13是回车键
					if ($('liv_select') != '') {
						$('#toread').click();
					}
				}
			});
		}
	},
	catchValue: function() {
		var x = $('#liv_select').val();
		var res = this.state.course;
		for (var i = 0; i < res.length; i++) {
			if (res[i].split('_')[2].split('.')[0] == x) {
				return res[i];
			}
		}
	},
	handleSelect: function() {
		var that = this;
		$('#search').on('change', function() {
			if (that.state.usnClick) {
				that.usnDisplay();
			} else if (that.state.clnClick) {
				that.clnDisplay();
			}
		})
	},
	handleSearch: function() {
		var that = this;
		$("#usn").on('click', function() {
			that.setState({
				usnClick: true,
				clnClick: false,
				flnClick: false
			}, function() {
				that.usnDisplay();
				that.handleSelect();
			});
		})
		$("#cln").on('click', function() {
			that.setState({
				usnClick: false,
				clnClick: true,
				flnClick: false
			}, function() {
				that.clnDisplay();
				that.handleSelect();
			});
		})
		$("#fln").on('click', function() {
			that.setState({
				usnClick: false,
				clnClick: false,
				flnClick: true
			});
		})
	},
	queryAllLiv: function() {
		var that = this;
		$.ajax({
			async: true,
			url: 'http://203.195.173.135:9000/files/list?format=json',
			type: 'GET',
			timeout: 5000,
			success: function(res) {
				var usn = [],
					rss = [],
					cln = [];

				for (var i = 0; i < res.length; i++) {
					if (res[i].split("_").length == 3) {
						rss.push(decodeURI(res[i]));
					}
				}

				for (var i = 0; i < rss.length; i++) {
					if (usn.indexOf(rss[i].split("_")[0]) == -1) {
						usn.push(rss[i].split("_")[0]);
					}
					if (cln.indexOf(rss[i].split("_")[1]) == -1) {
						cln.push(rss[i].split("_")[1]);
					}
				}

				that.setState({
					course: rss,
					usn: usn,
					cln: cln
				}, function() {
					that.usnDisplay();
				});

			}
		})

	},
	usnDisplay: function() {
		var tip = $('#search').val(),
			res = this.state.course,
			fln = [];
		for (var i = 0; i < res.length; i++) {
			if (res[i].split("_")[0] == tip) {
				fln.push(res[i]);
			}
		}
		this.setState({
			displayFile: fln
		});
	},
	clnDisplay: function() {
		var tip = $('#search').val(),
			res = this.state.course,
			fln = [];
		for (var i = 0; i < res.length; i++) {
			if (res[i].split("_")[1] == tip) {
				fln.push(res[i]);
			}
		}
		this.setState({
			displayFile: fln
		});
	},
	render: function() {
		var usnColor = this.state.usnClick ? "" : "#DCDCDC";
		var clnColor = this.state.clnClick ? "" : "#DCDCDC";
		var flnColor = this.state.flnClick ? "" : "#DCDCDC";
		return ( < div className = "panel panel-info" >
			< div className = "panel-heading" >
			< span className = "glyphicon glyphicon-search pull-left" > < /span> 

			< a className = "search"
			id = "usn"
			style = {
				{
					color: usnColor
				}
			} > 用户 < /a> 

			< a className = "search"
			id = "cln"
			style = {
				{
					color: clnColor
				}
			} > 课号 < /a >

			< a className = "search"
			id = "fln"
			style = {
				{
					color: flnColor
				}
			} > 课程 < /a >

			< a id = 'toread' > < span className = "glyphicon glyphicon-log-in pull-right"
			style = {
				{
					color: '#00BFFF',
					fontSize: '20px'
				}
			} > < /span></a >
			< /div >

			< div className = "panel-body" > {
				this.state.flnClick ? < span > < input className = "form-control"
				id = "liv_select"
				list = "flnlist" / > < datalist id = "flnlist" > {
					this.state.course.map(function(name) {
						return <option key = {
							name
						}
						value = {
							name.split('_')[2].split('.')[0]
						} > {
							name.split('_')[2].split('.')[0]
						} < /option>
					})
				} < /datalist> </span > : < span > < select id = "search" > {
					this.state.clnClick ? this.state.cln.map(function(cn) {
						return <option key = {
							cn
						}
						value = {
							cn
						} > {
							cn
						} < /option>
					}) : this.state.usn.map(function(un) {
						return <option key = {
							un
						}
						value = {
							un
						} > {
							un
						} < /option>
					})

				} < /select > < select id = "liv_select" > {
				this.state.displayFile.map(function(df) {
					return <option key = {
						df
					}
					value = {
						df
					} > {
						df.split('_')[2].split('.')[0]
					} < /option>
				})
			} < /select > < /span >
		} < /div > < /div > );
}
});

module.exports = Select;