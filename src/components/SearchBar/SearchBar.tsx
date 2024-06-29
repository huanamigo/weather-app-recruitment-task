import { useSearchParams } from 'react-router-dom';
import styles from './SearchBar.module.scss';

interface SearchProps {
  fetchData: (fetchUrl: string) => Promise<void>;
  URL: string;
}

const SearchBar = ({ fetchData, URL }: SearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className={styles.container}>
      <input
        type="text"
        onChange={(e) => setSearchParams({ search: e.target.value })}
        defaultValue={searchParams.get('search') || ''}
      />
      <div className={styles.fetchBtnWrapper} onClick={() => fetchData(URL)}>
        {searchParams.get('search') ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
