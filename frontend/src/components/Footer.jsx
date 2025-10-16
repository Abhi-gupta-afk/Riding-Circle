import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
	return (
		<footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-2 mb-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<i className="fas fa-motorcycle text-white text-sm"></i>
							</div>
							<span className="text-xl font-semibold text-gray-900 dark:text-white">RideCircle</span>
						</div>
						<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
							The modern platform for bikers to join clubs, plan epic trips, and share experiences.
						</p>
					</div>
					<div>
						<h4 className="text-gray-900 dark:text-white font-semibold mb-3">Explore</h4>
						<ul className="space-y-2 text-sm">
							<li><Link to="/clubs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Clubs</Link></li>
							<li><Link to="/trips" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Trips</Link></li>
							<li><Link to="/restaurants" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Restaurants</Link></li>
							<li><Link to="/reviews" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Reviews</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-gray-900 dark:text-white font-semibold mb-3">Account</h4>
						<ul className="space-y-2 text-sm">
							<li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Login</Link></li>
							<li><Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Register</Link></li>
							<li><Link to="/profile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Profile</Link></li>
							<li><Link to="/subscription-plans" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Subscription</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-gray-900 dark:text-white font-semibold mb-3">Follow</h4>
						<div className="flex space-x-3 text-gray-600 dark:text-gray-400">
							<a href="#" aria-label="Twitter" className="hover:text-blue-600"><i className="fab fa-x-twitter"></i></a>
							<a href="#" aria-label="Instagram" className="hover:text-blue-600"><i className="fab fa-instagram"></i></a>
							<a href="#" aria-label="YouTube" className="hover:text-blue-600"><i className="fab fa-youtube"></i></a>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row items-center justify-between">
					<p>© {new Date().getFullYear()} RideCircle. All rights reserved.</p>
					<div className="space-x-4 mt-2 md:mt-0">
						<a href="#" className="hover:text-blue-600">Privacy</a>
						<a href="#" className="hover:text-blue-600">Terms</a>
						<a href="#" className="hover:text-blue-600">Contact</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
