import { useState, useEffect } from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';

const GET_ARRAY = gql`
  query Query($page: Int) {
    getArray(page: $page)
  }
`

function App() {

  const [arr, setArr] = useState([])
  const [fetchIndex, setFetchIndex] = useState(0)

  const { error, loading, data, refetch } = useQuery(GET_ARRAY, {
    variables: {
      page: fetchIndex
    }
  })

  useEffect(() => {
    if (data) setArr(arr => [...arr, ...data.getArray])
  }, [data])

  const fetchMore = () => {
    console.log('fetch more clicked')
    refetch({

      page: fetchIndex
      
    })
    setFetchIndex(i => i + 1)
  }
  
  if (error) return <h1> error </h1>
  if (loading) return <h1> loading </h1>


  return (
    <div className="App" >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          arr.map((item, i) => {
            return (
              <div key={i} style={{width: 40, height: 40, background: 'blue', borderRadius: '50%', display: 'grid', placeItems: 'center'}} >
                {item}
              </div>
            )
          })
        }
      </div>
      <div onClick={() => fetchMore()}> load more</div>
    </div>
  );
}

export default App;
