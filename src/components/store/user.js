import { ID } from "appwrite";
import { account } from "../../appwrite";
import { reactive } from "vue";
//import { router } from '/src/main';
export const user = reactive({
  current: null,
  
  async init() {
    
    try {
      
      this.current = await account.get();
    } catch (e) {
      this.current = null;
    }
  },
  async register(email, password) {
    await account.create(ID.unique(), email, password);
    await this.login(email, password);
  },
  async login(email, password) {
    await account.createEmailPasswordSession(email, password);
     window.location.href = "/create"; // Redirect to home page
    //router.push('/create'); // Ensure this path is correct
  },
  async logout() {
    await account.deleteSession("current");
    this.current = null;
  },
});


