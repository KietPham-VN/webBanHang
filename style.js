document.addEventListener("DOMContentLoaded", () => {
	// Lắng nghe sự kiện submit cho form
	document.querySelector("form").addEventListener("submit", (event) => {
		event.preventDefault();
		let name = document.querySelector("#name").value;
		let price = parseFloat(document.querySelector("#price").value);
		let amount = document.querySelector("#amount").value;
		let description = document.querySelector("#description").value;

		// Kiểm tra thông tin nhập vào
		if (!name.trim() || isNaN(price) || price <= 0 || !amount.trim()) {
			alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
			return;
		}

		let item = {
			id: new Date().toISOString(),
			name: name.trim(),
			price: price,
			oldPrice: (2 * price).toString(), // Giá cũ là gấp đôi giá mới
			amount: amount.trim(),
			description: description.trim(),
		};

		addItemToUI(item);
		addItemToLocalStorage(item);
		clearInputs();
	});

	// Thêm sự kiện keydown cho các input
	const inputs = document.querySelectorAll("input, textarea");
	inputs.forEach((input, index) => {
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault(); // Ngăn chặn hành động mặc định
				if (input === inputs[inputs.length - 2]) {
					// Nếu đang ở trường mô tả, thực hiện submit
					document.querySelector("form").dispatchEvent(new Event("submit"));
				} else {
					// Chuyển focus tới input tiếp theo
					const nextInput = inputs[index + 1];
					if (nextInput) {
						nextInput.focus();
					}
				}
			}
		});
	});

	// Hàm xóa nội dung input
	const clearInputs = () => {
		inputs.forEach((input) => (input.value = "")); // Xóa tất cả các trường input
	};

	// Hàm nhận item và hiển thị lên UI
	const addItemToUI = (item) => {
		const { id, name, price, oldPrice, amount, description } = item;
		let newCard = document.createElement("div");
		newCard.className = "card-block mb-3"; // Thêm khoảng cách dưới mỗi card
		newCard.innerHTML = `
					<div class="card-img">
							<img src="https://nuochoa95.com/Data/images/san%20pham/Parfums%20de%20Marly/parfums-de-marly-delina-exclusif.jpg"/>
					</div>
					<div class="card-info" data-id="${id}">
							<h5 class="card-title">${name}</h5>
							<div class="price d-flex justify-content-around">
									<p class="new-price">${price}</p>
									<p class="old-price">${oldPrice}</p>
							</div>
					</div>
			`;
		newCard.onclick = () => viewProduct(item);
		document.querySelector(".card-carousel").appendChild(newCard);
	};

	// Hàm lấy danh sách từ localStorage
	const getList = () => JSON.parse(localStorage.getItem("list")) || [];

	// Hàm lưu item vào localStorage
	const addItemToLocalStorage = (item) => {
		let list = getList(); // Lấy danh sách từ localStorage
		list.push(item); // Thêm item vào mảng
		localStorage.setItem("list", JSON.stringify(list)); // Lưu danh sách vào localStorage
	};

	// Hàm hiển thị lại danh sách sản phẩm khi tải lại trang
	const init = () => {
		let list = getList(); // Lấy danh sách từ localStorage
		list.forEach((item) => addItemToUI(item)); // Hiển thị từng item
	};

	// Khởi chạy hàm init khi trang được tải
	init();

	// Hàm xem chi tiết sản phẩm
	function viewProduct(item) {
		document.querySelector("#name").value = item.name;
		document.querySelector("#price").value = item.price;
		document.querySelector("#amount").value = item.amount;
		document.querySelector("#description").value = item.description;

		// Xử lý nút "Delete"
		document.querySelector(".btn-danger").onclick = () => {
			deleteItem(item.id);
		};
	}

	// Hàm xóa sản phẩm
	function deleteItem(id) {
		let list = getList();
		list = list.filter((item) => item.id !== id);
		localStorage.setItem("list", JSON.stringify(list)); // Cập nhật localStorage
		document.querySelector(".card-carousel").innerHTML = ""; // Xóa hiển thị trên UI
		list.forEach((item) => addItemToUI(item)); // Hiển thị lại danh sách
		clearInputs(); // Xóa các trường input
	}

	// Lọc danh sách sản phẩm
	document.querySelector(".search").addEventListener("keyup", (event) => {
		let inputValue = event.target.value.toLowerCase();
		let list = getList();
		document.querySelector(".card-carousel").innerHTML = ""; // Xóa danh sách hiện tại

		list.forEach((item) => {
			if (item.name.toLowerCase().includes(inputValue)) {
				addItemToUI(item); // Hiển thị lại sản phẩm nếu tên chứa chuỗi tìm kiếm
			}
		});
	});

	// Xử lý nút "Clear"
	document.querySelector(".btn-secondary").addEventListener("click", () => {
		if (confirm("Bạn có chắc chắn muốn xóa tất cả thông tin không?")) {
			localStorage.removeItem("list"); // Xóa dữ liệu trong localStorage
			document.querySelector(".card-carousel").innerHTML = ""; // Xóa hiển thị trên UI
			clearInputs(); // Xóa tất cả các input
			alert("Đã xóa tất cả sản phẩm.");
		}
	});
});
