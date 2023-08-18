import UserCard from '@/components/cards/UserCard';
import Searchbar from '@/components/shared/Searchbar';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Page() {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	// Fetch Users
	const result = await fetchUsers({
		userId: user.id,
		searchString: '',
		pageNumber: 1,
		pageSize: 25,
	});

	return (
		<section>
			<h1 className='mb-10 head-text'>Search</h1>

			<Searchbar routeType='search' />

			<div className='flex flex-col mt-14 gap-9'>
				{result.users.length === 0 ? (
					<p className='no-result'>No Result</p>
				) : (
					<>
						{result.users.map((person) => (
							<UserCard
								key={person.id}
								id={person.id}
								name={person.name}
								username={person.username}
								imgUrl={person.image}
								personType='User'
							/>
						))}
					</>
				)}
			</div>

			<Pagination
				path='search'
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNext={result.isNext}
			/>
		</section>
	);
}

export default Page;
