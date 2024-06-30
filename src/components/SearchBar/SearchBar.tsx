import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './SearchBar.module.scss';

interface SearchProps {
  fetchData: (fetchUrl: string) => Promise<void>;
  URL: string;
  searchError: string;
}

const SearchBar = ({ fetchData, URL, searchError }: SearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/weather?search=${searchParams.get('search')}`);
    console.log(searchError);
    fetchData(URL);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backBtn} onClick={() => handleGoBack()}>
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
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchParams({ search: e.target.value })}
          defaultValue={searchParams.get('search') || ''}
        />
        <div className={styles.fetchBtnWrapper} onClick={() => handleSearch()}>
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
    </div>
  );
};

export default SearchBar;
