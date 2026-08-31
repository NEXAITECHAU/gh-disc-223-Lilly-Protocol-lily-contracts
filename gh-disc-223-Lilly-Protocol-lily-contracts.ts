// File: pallets/protocol/src/lib.rs
//! Protocol pallet for managing single-key configuration values

#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{dispatch::DispatchResult, pallet_prelude::*, traits::Get};
use frame_system::pallet_prelude::*;
use sp_runtime::traits::AtLeast32BitUnsigned;

pub type ConfigValue<T> = BoundedVec<u8, T::MaxConfigValueLen>;

#[frame_support::pallet]
pub mod pallet {
	use super::*;

	#[pallet::config]
	pub trait Config: frame_system::Config {
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
		type MaxConfigValueLen: Get<u32>;
	}

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		ConfigSet { key: Vec<u8>, value: ConfigValue<T> },
		ConfigRemoved { key: Vec<u8> },
	}

	#[pallet::error]
	pub enum Error<T> {
		ValueTooLong,
		KeyNotFound,
	}

	#[pallet::storage]
	#[pallet::getter(fn config_value)]
	pub type ConfigValues<T: Config> = StorageMap<_, Blake2_128Concat, Vec<u8>, ConfigValue<T>, ValueQuery>;

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::weight(10_000)]
		pub fn set_config_value(
			origin: OriginFor<T>,
			key: Vec<u8>,
			value: ConfigValue<T>,
		) -> DispatchResult {
			ensure_signed(origin)?;
			
			// Store the config value
			<ConfigValues<T>>::insert(&key, value.clone());
			
			Self::deposit_event(Event::ConfigSet { key, value });
			Ok(())
		}

		#[pallet::weight(10_000)]
		pub fn remove_config_value(origin: OriginFor<T>, key: Vec<u8>) -> DispatchResult {
			ensure_signed(origin)?;
			
			ensure!(<ConfigValues<T>>::contains_key(&key), Error::<T>::KeyNotFound);
			<ConfigValues<T>>::remove(&key);
			
			Self::deposit_event(Event::ConfigRemoved { key });
			Ok(())
		}

		#[pallet::weight(10_000)]
		pub fn get_config_value(origin: OriginFor<T>, key: Vec<u8>) -> DispatchResult {
			ensure_signed(origin)?;
			
			let value = <ConfigValues<T>>::get(&key);
			ensure!(!value.is_empty(), Error::<T>::KeyNotFound);
			
			// Return the value via event (since extrinsics can't return values directly)
			Self::deposit_event(Event::ConfigValueRetrieved { key, value });
			Ok(())
		}

		#[pallet::weight(10_000)]
		pub fn get_config_values(origin: OriginFor<T>, keys: Vec<Vec<u8>>) -> DispatchResult {
			ensure_signed(origin)?;
			
			for key in keys {
				if let Some(value) = <ConfigValues<T>>::get(&key) {
					Self::deposit_event(Event::ConfigValueRetrieved { key, value });
				}
			}
			Ok(())
		}
	}

	#[pallet::event]
	pub enum Event<T: Config> {
		ConfigSet { key: Vec<u8>, value: ConfigValue<T> },
		ConfigRemoved { key: Vec<u8> },
		ConfigValueRetrieved { key: Vec<u8>, value: ConfigValue<T> },
	}
}

// Add to runtime/src/lib.rs:
// impl protocol::Config for Runtime {
//     type Event = Event;
//     type MaxConfigValueLen = ConstU32<256>;
// }