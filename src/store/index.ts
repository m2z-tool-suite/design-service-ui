import { reactive } from "vue";
import { axiosDesign } from "@/service/index";

const store = {
  state: reactive({
    meta: [],
  }),
  actions: {
    async fetchMeta() {
      const response = await axiosDesign.get("/meta");
      store.state.meta = response.data;
    },
  },
};

export default store;
