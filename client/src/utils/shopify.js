export const formatMoney = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const getVariantOptions = (product) => {
  if (!product.variants || product.variants.length <= 1) return null;

  const options = {};
  product.variants.forEach(variant => {
    variant.option_values.forEach(option => {
      if (!options[option.name]) {
        options[option.name] = new Set();
      }
      options[option.name].add(option.value);
    });
  });

  return Object.entries(options).map(([name, values]) => ({
    name,
    values: Array.from(values)
  }));
};

export const findVariantByOptions = (product, selectedOptions) => {
  return product.variants.find(variant =>
    variant.option_values.every(option =>
      selectedOptions[option.name] === option.value
    )
  );
};

export const checkVariantAvailability = async (variantId) => {
  try {
    const response = await fetch(
      `/api/shopify/variants/${variantId}/inventory`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Error checking variant availability:', error);
    return false;
  }
};