import { StyleSheet } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  rowSpacing: {
    flexDirection: 'row',
    alignItems: 'center',     // vertical alignment
    justifyContent: 'space-between', // horizontal spacing
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',     // vertical alignment
    justifyContent: 'flex-start', // horizontal spacing
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'baseline',     // vertical alignment
    justifyContent: 'center', // horizontal spacing
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',     // horizontal alignment
    justifyContent: 'flex-start', // vertical alignment
  },
  columnCentered: {
    flexDirection: 'column',
    alignItems: 'center',     // horizontal alignment
    justifyContent: 'center', // vertical alignment
  },    
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '90%',
    marginVertical: 5,
    marginLeft: '5%'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold', 
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'flex-start',
    fontFamily: 'Nunito_700Bold', 
  },
   cardTitleText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'Nunito_700Bold',
  },
   cardSubtitleText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Nunito_400Regular',
  },
  // Add more styles here
});

export default globalStyles