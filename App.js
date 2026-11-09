import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';

const GOLD = '#D8BD83';
const BG = '#171719';
const CARD = '#242426';
const MUTED = '#AAA6A0';

const sampleRequests = [
  {id:1, category:'Bills', title:'Electricity bill assistance', description:'Help with an upcoming household electricity bill.', amount:18500, location:'Idaho'},
  {id:2, category:'Everyday', title:'Grocery assistance', description:'Help with essential groceries for the month.', amount:12000, location:'Oregon'},
  {id:3, category:'Kindness', title:'Birthday surprise', description:'A little help making a birthday special.', amount:5000, location:'Texas'}
];

export default function App() {
  const [tab, setTab] = useState('Give');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [sponsored, setSponsored] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const money = cents => '$' + (cents / 100).toFixed(2);
  const visible = sampleRequests.filter(r =>
    filter === 'All' || r.category === filter
  );

  function sponsor(request) {
    setSelected(request);
  }

  function submitRequest() {
    if (!title.trim() || !amount.trim() || !description.trim()) {
      setMessage('Please complete all three fields.');
      return;
    }
    setMessage('Your sample request is ready for review. No information has been submitted or saved.');
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.logo}>Swipe<Text style={{color:GOLD}}>Kind</Text></Text>
        <Text style={s.tagline}>A little kindness goes a long way.</Text>
      </View>

      <View style={s.tabs}>
        {['Give','Request'].map(t => (
          <TouchableOpacity key={t} onPress={() => {
            setTab(t); setSelected(null); setMessage('');
          }} style={[s.tab, tab===t && s.activeTab]}>
            <Text style={[s.tabText,tab===t && {color:GOLD}]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'Give' ? (
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.eyebrow}>THE KINDNESS FEED</Text>
          <Text style={s.heading}>Make someone's day.</Text>
          <Text style={s.sub}>Browse requests. Choose when you're ready to help.</Text>

          <View style={s.filters}>
            {['All','Bills','Everyday','Kindness'].map(f => (
              <TouchableOpacity key={f} onPress={() => setFilter(f)}
                style={[s.filter,filter===f && s.selectedFilter]}>
                <Text style={{color:filter===f?BG:MUTED,fontSize:12}}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {visible.map(r => (
            <View key={r.id} style={s.card}>
              <Text style={s.category}>{r.category.toUpperCase()} · {r.location}</Text>
              <Text style={s.cardTitle}>{r.title}</Text>
              <Text style={s.description}>{r.description}</Text>
              <Text style={s.amount}>{money(r.amount)}</Text>
              <TouchableOpacity style={s.goldButton} onPress={() => sponsor(r)}>
                <Text style={s.goldButtonText}>VIEW SPONSORSHIP</Text>
              </TouchableOpacity>
              <Text style={s.privacy}>Recipient identity is kept private.</Text>
            </View>
          ))}

          <Text style={s.footer}>SWIPEKIND · KINDNESS WITHOUT JUDGMENT</Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.eyebrow}>ASK FOR A LITTLE HELP</Text>
          <Text style={s.heading}>Your needs matter.</Text>
          <Text style={s.sub}>No public sob stories. No judgment. Your identity stays private from donors.</Text>

          <Text style={s.label}>What do you need help with?</Text>
          <TextInput style={s.input} placeholder="Example: Electricity bill" placeholderTextColor="#888"
            value={title} onChangeText={setTitle}/>

          <Text style={s.label}>Amount requested (USD)</Text>
          <TextInput style={s.input} placeholder="Example: 185.00" placeholderTextColor="#888"
            keyboardType="decimal-pad" value={amount} onChangeText={setAmount}/>

          <Text style={s.label}>Brief description</Text>
          <TextInput style={[s.input,s.multiline]} multiline
            placeholder="Tell us what the assistance will cover." placeholderTextColor="#888"
            value={description} onChangeText={setDescription}/>

          <TouchableOpacity style={s.goldButton} onPress={submitRequest}>
            <Text style={s.goldButtonText}>PREVIEW REQUEST</Text>
          </TouchableOpacity>
          {!!message && <Text style={s.notice}>{message}</Text>}
          <Text style={s.privacy}>Demo only. This form does not submit personal information.</Text>
        </ScrollView>
      )}

      {selected && (
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.eyebrow}>SPONSORSHIP PREVIEW</Text>
            <Text style={s.heading}>{selected.title}</Text>
            <Text style={s.sub}>Your contribution</Text>
            <Text style={s.amount}>{money(selected.amount)}</Text>
            <View style={s.line}><Text style={s.sub}>Illustrative platform fee (4%)</Text>
              <Text style={s.white}>{money(Math.round(selected.amount*.04))}</Text></View>
            <View style={s.line}><Text style={s.white}>Estimated total</Text>
              <Text style={s.amount}>{money(Math.round(selected.amount*1.04))}</Text></View>
            <Text style={s.privacy}>No payment will be taken. This is a visual demo only.</Text>
            <TouchableOpacity style={s.goldButton} onPress={() => {
              setSponsored([...sponsored,selected.id]); setSelected(null);
            }}>
              <Text style={s.goldButtonText}>CLOSE PREVIEW</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelected(null)} style={{padding:15}}>
              <Text style={{color:MUTED,textAlign:'center'}}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:BG},
  header:{padding:24,paddingBottom:18},
  logo:{fontSize:34,fontWeight:'bold',color:'#F6F0E7',letterSpacing:1},
  tagline:{color:MUTED,fontSize:12,marginTop:5},
  tabs:{flexDirection:'row',borderBottomWidth:1,borderColor:'#444'},
  tab:{flex:1,alignItems:'center',padding:15},
  activeTab:{borderBottomWidth:2,borderColor:GOLD},
  tabText:{color:MUTED,fontSize:15,fontWeight:'600'},
  content:{padding:20,paddingBottom:50},
  eyebrow:{color:GOLD,fontSize:11,letterSpacing:2,marginBottom:10},
  heading:{fontSize:27,color:'#F6F0E7',fontWeight:'600'},
  sub:{color:MUTED,fontSize:14,lineHeight:21,marginTop:8,marginBottom:20},
  filters:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:18},
  filter:{borderWidth:1,borderColor:'#555',borderRadius:20,paddingVertical:8,paddingHorizontal:14},
  selectedFilter:{backgroundColor:GOLD,borderColor:GOLD},
  card:{backgroundColor:CARD,borderRadius:15,padding:19,marginBottom:15,borderWidth:1,borderColor:'#3B3935'},
  category:{color:GOLD,fontSize:10,letterSpacing:1.5},
  cardTitle:{color:'#F6F0E7',fontSize:19,fontWeight:'600',marginTop:12},
  description:{color:MUTED,fontSize:13,lineHeight:20,marginTop:8},
  amount:{color:GOLD,fontSize:27,fontWeight:'bold',marginVertical:16},
  goldButton:{backgroundColor:GOLD,padding:15,borderRadius:9,alignItems:'center',marginTop:8},
  goldButtonText:{color:'#211F1B',fontWeight:'bold',fontSize:12,letterSpacing:1},
  privacy:{color:'#99938B',fontSize:11,textAlign:'center',marginTop:13},
  footer:{color:'#777',fontSize:10,textAlign:'center',marginTop:20},
  label:{color:'#E8E1D6',fontSize:13,marginTop:15,marginBottom:8},
  input:{backgroundColor:CARD,borderWidth:1,borderColor:'#494642',borderRadius:9,padding:14,color:'white',fontSize:15},
  multiline:{height:110,textAlignVertical:'top'},
  notice:{color:GOLD,marginTop:15,lineHeight:20},
  overlay:{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'#000D',justifyContent:'center',padding:20},
  modal:{backgroundColor:CARD,borderRadius:18,padding:22,borderWidth:1,borderColor:GOLD},
  line:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:9},
  white:{color:'#F6F0E7',fontSize:15}
});