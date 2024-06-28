import { useSearchParams } from 'react-router-dom';

interface SearchProps {
  fetchData: (fetchUrl: string) => Promise<void>;
  URL: string;
}

const SearchBar = ({ fetchData, URL }: SearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchParams({ search: e.target.value })}
        defaultValue={String(searchParams.get('search'))}
      />
      <button onClick={() => fetchData(URL)}>fetch</button>
    </div>
  );
};

export default SearchBar;
