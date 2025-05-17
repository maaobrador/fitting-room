import {Asset} from 'expo-asset';
const clothesLists =[
    {
      id : 1,
      name: 'Orange Jacket',
      image: 'https://purepng.com/public/uploads/large/purepng.com-orange-jacketgarmentupper-bodyjacketlighterorange-1421526362337wpzv6.png',
      model: Asset.fromModule(require('@/assets/models/denimJacket.glb')).uri,
   },
  {
      id : 2,
      name: 'Red T-shirt',
      image: 'https://purepng.com/public/uploads/large/red-t-shirt-plp.png',
      model: Asset.fromModule(require('@/assets/models/flouncingBlouse.glb')).uri,
   },
   {
       id : 3,
       name: 'White Shirt',
       image: 'https://purepng.com/public/uploads/large/purepng.com-full-length-dress-shirtbutton-front-shirtgarmentfull-lengthdressshirtcasual-1421526306230wky35.png',
       model: Asset.fromModule(require('@/assets/models/tshirt.glb')).uri,
   },
  ]
  
  export default clothesLists;